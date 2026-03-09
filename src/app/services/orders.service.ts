import { Injectable, signal, computed } from '@angular/core';

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
  private ordersSignal = signal<Order[]>([
    {
      id: '1',
      customerName: 'Jan Kowalski',
      carModel: 'Audi A4 B8',
      licensePlate: 'WA 12345',
      issueDescription: 'Wymiana rozrządu i pompy wody',
      status: 'progress',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      customerName: 'Anna Nowak',
      carModel: 'Toyota Corolla',
      licensePlate: 'KR 56789',
      issueDescription: 'Przegląd olejowy i filtry',
      status: 'new',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);

  readonly orders = computed(() => this.ordersSignal());

  updateOrderStatus(orderId: string, newStatus: OrderStatus) {
    this.ordersSignal.update(orders => 
      orders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus, updatedAt: new Date() } 
          : order
      )
    );
    this.triggerWebhook(orderId, newStatus);
  }

  private triggerWebhook(orderId: string, status: OrderStatus) {
    // Placeholder for Task 4
    console.log(`[Webhook] Order ${orderId} moved to ${status}`);
  }

  addOrder(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>) {
    const newOrder: Order = {
      ...order,
      id: Math.random().toString(36).substring(2, 9),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.ordersSignal.update(orders => [...orders, newOrder]);
  }
}
