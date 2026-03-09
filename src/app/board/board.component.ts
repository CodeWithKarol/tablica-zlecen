import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { OrdersService, Order, OrderStatus } from '../services/orders.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule],
  template: `
    <div class="h-full flex flex-col">
      <div class="flex items-center justify-between mb-10">
        <div>
          <h2 class="text-3xl font-bold text-slate-900 tracking-tight">Tablica Zleceń</h2>
          <p class="text-sm text-slate-400 font-medium">Śledzisz 2 aktywne naprawy</p>
        </div>
        <button class="bg-primary-600 hover:bg-primary-700 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-primary-500/10 transition-all flex items-center gap-3">
          <span class="text-lg">+</span> Nowe zlecenie
        </button>
      </div>

      <div class="flex-1 flex gap-8 overflow-x-auto pb-6" cdkDropListGroup>
        @for (column of columns; track column.id) {
          <div class="flex-none w-80 flex flex-col">
            <div class="flex items-center justify-between mb-3 px-1">
               <h3 class="font-bold text-slate-900 text-sm tracking-tight">{{ column.title }}</h3>
               <span class="bg-slate-200 px-2 py-0.5 rounded text-[10px] font-black text-slate-500">
                 {{ getOrdersByStatus(column.id).length }}
               </span>
            </div>

            <div
              cdkDropList
              [cdkDropListData]="column.id"
              (cdkDropListDropped)="drop($event)"
              class="flex-1 space-y-3 min-h-[200px] p-2 bg-slate-100/30 border border-dashed border-slate-200 rounded-2xl"
            >
              @for (order of getOrdersByStatus(column.id); track order.id) {
                <div cdkDrag [cdkDragData]="order" class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-primary-400 transition-all cursor-grab active:cursor-grabbing group">
                  <div class="flex justify-between items-start mb-3">
                    <span class="text-[10px] font-black tracking-widest text-primary-700 bg-primary-50 px-2.5 py-1 rounded ring-1 ring-primary-100 ring-inset uppercase">
                      {{ order.licensePlate }}
                    </span>
                    <div class="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-primary-500 transition-colors"></div>
                  </div>
                  <h4 class="font-bold text-slate-900 text-sm mb-1 leading-tight">{{ order.carModel }}</h4>
                  <p class="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed mb-4">{{ order.issueDescription }}</p>
                  
                  <div class="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div class="flex flex-col">
                      <span class="text-[9px] text-slate-300 font-black uppercase tracking-tighter">Klient</span>
                      <span class="text-[11px] text-slate-600 font-bold leading-none">{{ order.customerName }}</span>
                    </div>
                    <div class="w-6 h-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                       <span class="text-[8px] font-black text-slate-400">{{ order.customerName[0] }}</span>
                    </div>
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .cdk-drag-preview {
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border-radius: 12px;
      opacity: 0.9;
    }
    .cdk-drag-placeholder {
      opacity: 0.2;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .flex-1.space-y-4.cdk-drop-list-dragging .card:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  private orderService = inject(OrdersService);

  columns: { id: OrderStatus; title: string }[] = [
    { id: 'new', title: 'Nowe' },
    { id: 'progress', title: 'W trakcie' },
    { id: 'waiting', title: 'Czeka na części' },
    { id: 'done', title: 'Gotowe / SMS' },
  ];

  getOrdersByStatus(status: OrderStatus) {
    return this.orderService.orders().filter((o) => o.status === status);
  }

  drop(event: CdkDragDrop<OrderStatus>) {
    const order = event.item.data as Order;
    const newStatus = event.container.data as OrderStatus;
    
    if (order.status !== newStatus) {
      this.orderService.updateOrderStatus(order.id, newStatus);
    }
  }
}
