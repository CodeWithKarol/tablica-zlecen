import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
// no more environment import

export type OrderStatus = 'new' | 'progress' | 'done' | 'collected';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  carModel: string;
  issueDescription: string;
  status: OrderStatus;
  deadline?: string;
  priority: 'low' | 'medium' | 'high';
  estimatedPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private supabase: SupabaseClient;
  private platformId = inject(PLATFORM_ID);
  private ordersSignal = signal<Order[]>([]);

  readonly orders = computed(() => this.ordersSignal());

  constructor() {
    console.log('Initializing Supabase with URL:', SUPABASE_URL);
    console.log('Supabase Key (masked):', SUPABASE_KEY ? `${SUPABASE_KEY.substring(0, 10)}...${SUPABASE_KEY.substring(SUPABASE_KEY.length - 5)}` : 'MISSING');
    this.supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
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

  async updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    const { error } = await this.supabase
      .from('orders')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order:', error);
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
    const payload = {
      event: 'order.status_changed',
      newStatus: 'done',
      order: {
        id: order.id,
        customer: order.customerName,
        car: order.carModel,
        phone: order.customerPhone
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
    const { error } = await this.supabase
      .from('orders')
      .insert([
        {
          customer_name: order.customerName,
          customer_phone: order.customerPhone,
          car_model: order.carModel,
          issue_description: order.issueDescription,
          status: order.status,
          deadline: order.deadline,
          priority: order.priority,
          estimated_price: order.estimatedPrice
        }
      ]);

    if (error) {
      console.error('Error adding order:', error);
    }
  }

  private mapToOrder(raw: any): Order {
    return {
      id: raw.id,
      customerName: raw.customer_name,
      customerPhone: raw.customer_phone,
      carModel: raw.car_model,
      issueDescription: raw.issue_description,
      status: raw.status as OrderStatus,
      deadline: raw.deadline,
      priority: raw.priority,
      estimatedPrice: raw.estimated_price,
      createdAt: new Date(raw.created_at),
      updatedAt: new Date(raw.updated_at)
    };
  }
}
