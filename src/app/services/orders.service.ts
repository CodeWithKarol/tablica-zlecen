import { Injectable, signal, computed, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

export type OrderStatus = 'new' | 'progress' | 'waiting' | 'done';

export interface Order {
  id: string;
  customerName: string;
  carModel: string;
  licensePlate: string;
  issueDescription: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable({
  providedIn: 'root'
})
export class OrdersService {
  private supabase: SupabaseClient;
  private ordersSignal = signal<Order[]>([]);

  readonly orders = computed(() => this.ordersSignal());

  constructor() {
    console.log('Initializing Supabase with URL:', environment.supabaseUrl);
    console.log('Supabase Key (masked):', environment.supabaseKey ? `${environment.supabaseKey.substring(0, 10)}...${environment.supabaseKey.substring(environment.supabaseKey.length - 5)}` : 'MISSING');
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
    this.fetchOrders();
    this.setupRealtimeSync();
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
    }
  }

  async addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const { error } = await this.supabase
      .from('orders')
      .insert([
        {
          customer_name: order.customerName,
          car_model: order.carModel,
          license_plate: order.licensePlate,
          issue_description: order.issueDescription,
          status: order.status
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
      carModel: raw.car_model,
      licensePlate: raw.license_plate,
      issueDescription: raw.issue_description,
      status: raw.status as OrderStatus,
      createdAt: new Date(raw.created_at),
      updatedAt: new Date(raw.updated_at)
    };
  }
}
