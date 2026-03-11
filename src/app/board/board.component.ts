import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { OrdersService, Order, OrderStatus } from '../services/orders.service';
import { OrderFormComponent } from './order-form.component';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, OrderFormComponent],
  template: `
<div class="h-full flex flex-col">
  <div class="flex items-end justify-between mb-12 border-b-2 border-black pb-8">
    <div>
      <h2 class="text-5xl font-black uppercase tracking-tighter">System_Tablicy</h2>
      <div class="flex items-center gap-4 mt-2 font-mono text-[10px] uppercase">
        <span class="text-orange-600 font-bold">[STATUS: ACTIVE]</span>
        <span class="text-zinc-400">// ANALIZA_ZLECEŃ: {{ filteredOrders().length }} OBIEKTÓW</span>
      </div>
    </div>

    <div class="flex-1 max-w-md mx-12 mb-1">
      <div class="relative">
        <input 
          type="text" 
          (input)="searchQuery.set($any($event.target).value)"
          placeholder="SZUKAJ_ZLECENIA..." 
          class="w-full bg-zinc-50 border border-black px-4 py-3 font-mono text-[11px] uppercase focus:outline-none focus:bg-white focus:border-orange-600 transition-none placeholder:text-zinc-400"
        />
        <div class="absolute -top-2 left-3 bg-black text-white text-[8px] px-1.5 py-0.5 font-mono uppercase tracking-widest pointer-events-none">
          FILTR_WYSZUKIWANIA
        </div>
      </div>
    </div>

    <button (click)="showOrderForm.set(true)" 
            class="bg-black text-white px-8 py-4 font-black uppercase text-sm hover:bg-orange-600 hover:text-black transition-none">
      + Nowe Zlecenie
    </button>
  </div>

  <div class="flex-1 flex gap-0 overflow-x-auto pb-6 border-l border-t border-black" cdkDropListGroup>
    @for (column of columns; track column.id) {
      <div class="flex-none w-80 flex flex-col border-r border-black">
        <div class="bg-zinc-100 p-4 border-b border-black flex items-center justify-between">
           <h3 class="font-black text-xs uppercase tracking-widest">{{ column.title }}</h3>
           <span class="font-mono text-[10px] font-bold text-orange-600">
             [{{ getOrdersByStatus(column.id).length }}]
           </span>
        </div>

        <div
          cdkDropList
          [cdkDropListData]="column.id"
          (cdkDropListDropped)="drop($event)"
          class="flex-1 space-y-0 min-h-[200px] p-0 bg-white"
        >
          @for (order of getOrdersByStatus(column.id); track order.id) {
            <div cdkDrag [cdkDragData]="order" 
                 class="bg-white p-6 border-b border-black hover:bg-zinc-50 transition-none cursor-grab active:cursor-grabbing group relative">
              <div class="flex justify-between items-start mb-4">
                <span class="font-mono text-[10px] font-black tracking-tighter text-black border border-black px-2 py-0.5 uppercase">
                  {{ order.customerPhone }}
                </span>
                <div class="w-3 h-3 border border-black group-hover:bg-orange-600 transition-none"
                     [class.bg-orange-600]="order.priority === 'high'"></div>
              </div>
              <h4 class="font-black text-sm uppercase mb-1 leading-none">{{ order.carModel }}</h4>
              <p class="text-[11px] text-zinc-500 font-medium line-clamp-2 leading-tight mb-6">{{ order.issueDescription }}</p>
              
              <div class="flex items-center justify-between pt-4 border-t border-black/10 font-mono">
                <div class="flex flex-col">
                  <span class="text-[8px] text-zinc-400 font-black uppercase tracking-tighter">Klient_ID</span>
                  <span class="text-[10px] text-black font-bold leading-none uppercase">{{ order.customerName }}</span>
                </div>
                <div class="w-6 h-6 border border-black flex items-center justify-center bg-zinc-100 text-[8px] font-black">
                   {{ order.customerName[0] }}
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    }
  </div>

  @if (showOrderForm()) {
    <app-order-form (close)="showOrderForm.set(false)" />
  }
</div>
`,
  styles: [`
    .cdk-drag-preview {
      opacity: 0.9;
      border: 1px solid black;
    }
    .cdk-drag-placeholder {
      opacity: 0.2;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  public orderService = inject(OrdersService);
  public showOrderForm = signal(false);
  public searchQuery = signal('');

  public filteredOrders = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const orders = this.orderService.orders();
    if (!query) return orders;

    return orders.filter(order => 
      order.customerName.toLowerCase().includes(query) ||
      order.carModel.toLowerCase().includes(query) ||
      order.customerPhone.includes(query) ||
      order.issueDescription.toLowerCase().includes(query)
    );
  });

  columns: { id: OrderStatus; title: string }[] = [
    { id: 'new', title: 'Nowe' },
    { id: 'progress', title: 'W toku' },
    { id: 'done', title: 'Gotowe' },
    { id: 'collected', title: 'Odebrane' },
  ];

  getOrdersByStatus(status: OrderStatus) {
    return this.filteredOrders().filter((o) => o.status === status);
  }

  drop(event: CdkDragDrop<OrderStatus>) {
    const order = event.item.data as Order;
    const newStatus = event.container.data as OrderStatus;
    
    if (order.status !== newStatus) {
      this.orderService.updateOrderStatus(order.id, newStatus);
    }
  }
}
