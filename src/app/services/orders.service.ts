import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

export type OrderStatus = 'new' | 'progress' | 'done' | 'collected';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  carModel: string;
  licensePlate: string;
  issueDescription: string;
  status: OrderStatus;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedPrice?: number;
  laborPrice?: number;
  partsPrice?: number;
  discountPrice?: number;
  photoUrls?: string[];
  userId?: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private supabase: SupabaseClient;
  private platformId = inject(PLATFORM_ID);
  private supabaseService = inject(SupabaseService);
  private ordersSignal = signal<Order[]>([]);

  readonly orders = computed(() => this.ordersSignal());

  constructor() {
    this.supabase = this.supabaseService.client;
    
    // We can fetch orders on both server and client for SSR benefits
    this.fetchOrders();

    // ONLY initialize Realtime (WebSockets) in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.setupRealtimeSync();
    }
  }

  private async fetchOrders() {
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
      return;
    }

    if (data) {
      this.ordersSignal.set(data.map(this.mapToOrder));
    }
  }

  private setupRealtimeSync() {
    this.supabase
      .channel('public:orders')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, () => {
        this.fetchOrders();
      })
      .subscribe();
  }

  async uploadPhoto(file: File): Promise<string> {
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const filePath = `uploads/${fileName}`;

    const { error } = await this.supabase.storage
      .from('order-photos')
      .upload(filePath, file);

    if (error) {
      console.error('Error uploading photo:', error);
      throw error;
    }

    const { data: { publicUrl } } = this.supabase.storage
      .from('order-photos')
      .getPublicUrl(filePath);

    return publicUrl;
  }

  async updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const previousOrders = this.ordersSignal();
    const orderToUpdate = previousOrders.find(o => o.id === orderId);
    
    if (!orderToUpdate || orderToUpdate.status === newStatus) return;

    // 1. Optimistic Update
    this.ordersSignal.update(orders => 
      orders.map(o => o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date() } : o)
    );

    // 2. Persistent Update
    const { error } = await this.supabase
      .from('orders')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order (rolling back):', error);
      // 3. Rollback on failure
      this.ordersSignal.set(previousOrders);
    } else if (newStatus === 'done') {
      this.triggerAutomation(orderId);
    }
  }

  private async triggerAutomation(orderId: string) {
    // For MVP 0.1, we fetch the order details and log the event
    const { data, error } = await this.supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (error || !data) {
      console.error('Automation: Could not fetch order details:', error);
      return;
    }

    const order = this.mapToOrder(data);
    const total = (order.laborPrice || 0) + (order.partsPrice || 0) - (order.discountPrice || 0);
    
    // Fetch template from DB or use default
    const { data: settingData } = await this.supabase
      .from('settings')
      .select('value')
      .eq('key', 'sms_template')
      .single();
    
    let template = settingData?.value || 'Zlecenie {order_id} dla {car_model} jest gotowe. Cena: {total_price} PLN.';
    
    const message = template
      .replace('{order_id}', order.id.substring(0, 8))
      .replace('{car_model}', order.carModel)
      .replace('{customer_name}', order.customerName)
      .replace('{total_price}', total.toString());

    const payload = {
      event: 'order.status_changed',
      newStatus: 'done',
      message: message,
      order: {
        id: order.id,
        customer: order.customerName,
        car: order.carModel,
        phone: order.customerPhone,
        totalPrice: total
      },
      timestamp: new Date().toISOString()
    };

    console.log('%c[AUTOMATION TRIGGERED]', 'background: #ea580c; color: white; padding: 2px 5px; font-weight: bold;');
    console.log('Status changed to DONE for order:', order.id);
    console.log('Payload:', payload);

    // Placeholder for real webhook call
    const savedUrl = typeof window !== 'undefined' ? localStorage.getItem('system_webhook_url') : null;
    if (savedUrl) {
      console.log('Sending webhook to:', savedUrl);
      try {
        await fetch(savedUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        console.log('Webhook sent successfully');
      } catch (e) {
        console.error('Webhook delivery failed:', e);
      }
    }
  }

  async createOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const previousOrders = this.ordersSignal();
    
    // 1. Generate a temporary ID and create the optimistic order
    const temporaryId = `temp-${Math.random().toString(36).substring(2, 9)}`;
    const optimisticOrder: Order = {
      ...order,
      id: temporaryId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // 2. Optimistic Update
    this.ordersSignal.update(orders => [optimisticOrder, ...orders]);

    // 3. Persistent Update
    const { data, error } = await this.supabase
      .from('orders')
      .insert([
        {
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          car_model: order.carModel,
          license_plate: order.licensePlate,
          issue_description: order.issueDescription,
          status: order.status,
          deadline: order.deadline,
          priority: order.priority,
          estimated_price: order.estimatedPrice,
          labor_price: order.laborPrice || 0,
          parts_price: order.partsPrice || 0,
          discount_price: order.discountPrice || 0,
          photo_urls: order.photoUrls || []
        }
      ])
      .select()
      .single();

    if (error) {
      console.error('Error adding order (rolling back):', error);
      // 4. Rollback on failure
      this.ordersSignal.set(previousOrders);
    } else if (data) {
      // 5. Replace temporary order with the real one from database
      this.ordersSignal.update(orders => 
        orders.map(o => o.id === temporaryId ? this.mapToOrder(data) : o)
      );
    }
  }

  private mapToOrder(raw: any): Order {
    return {
      id: raw.id,
      customerName: raw.customer_name,
      customerPhone: raw.customer_phone,
      carModel: raw.car_model,
      licensePlate: raw.license_plate,
      issueDescription: raw.issue_description,
      status: raw.status as OrderStatus,
      deadline: raw.deadline,
      priority: raw.priority,
      estimatedPrice: raw.estimated_price,
      laborPrice: raw.labor_price,
      partsPrice: raw.parts_price,
      discountPrice: raw.discount_price,
      photoUrls: raw.photo_urls || [],
      userId: raw.user_id,
      createdAt: new Date(raw.created_at),
      updatedAt: new Date(raw.updated_at)
    };
  }

  async getSetting(key: string): Promise<string | null> {
    const { data, error } = await this.supabase
      .from('settings')
      .select('value')
      .eq('key', key)
      .single();
    
    if (error) return null;
    return data.value;
  }

  async updateSetting(key: string, value: string) {
    const { error } = await this.supabase
      .from('settings')
      .upsert({ key, value, updated_at: new Date().toISOString() });
    
    if (error) console.error('Error updating setting:', error);
  }
}
