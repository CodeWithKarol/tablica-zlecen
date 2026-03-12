import { ChangeDetectionStrategy, Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  CdkDragDrop,
  DragDropModule,
} from '@angular/cdk/drag-drop';
import { OrdersService, Order, OrderStatus } from '../services/orders.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, DragDropModule, RouterLink],
  template: `
<div class="flex-1 flex flex-col text-white min-h-0">
  <!-- Header -->
  <div class="flex flex-col lg:flex-row lg:items-end justify-between mb-4 md:mb-8 border-b border-white/10 pb-4 md:pb-6 gap-6 print:hidden">
    <div class="flex-shrink-0">
      <h2 class="text-3xl md:text-5xl font-black uppercase tracking-tighter text-high-contrast">System_Tablicy</h2>
      <div class="flex items-center gap-4 mt-2 font-mono text-[10px] uppercase">
        <span class="text-orange-500 font-bold">[AKTYWNI: {{ filteredOrders().length }}]</span>
        <span class="text-white/40 hidden sm:inline">// ANALIZA_ZLECEŃ: {{ filteredOrders().length }} OBIEKTÓW</span>
      </div>
    </div>

    <div class="flex-1 w-full lg:max-w-md lg:px-6">
      <div class="relative">
        <input 
          type="text" 
          (input)="searchQuery.set($any($event.target).value)"
          placeholder="SZUKAJ_ZLECENIA..." 
          class="w-full bg-white/5 border border-white/10 px-4 py-3 font-mono text-[11px] uppercase focus:outline-none focus:bg-white/10 focus:border-orange-500 transition-all placeholder:text-white/20 text-white"
        />
        <div class="absolute -top-2 left-3 bg-orange-600 text-white text-[8px] px-1.5 py-0.5 font-mono uppercase tracking-widest pointer-events-none shadow-lg">
          FILTR_WYSZUKIWANIA
        </div>
      </div>
    </div>

    <a routerLink="/app/orders/new" 
            class="w-full lg:w-auto bg-neon-orange text-white px-8 py-4 font-black uppercase text-sm hover:scale-105 transition-transform shadow-[0_5px_15px_rgba(255,92,26,0.3)] text-center flex-shrink-0">
      + Nowe Zlecenie
    </a>
  </div>

  <!-- Kanban Board Container -->
  <div class="glass-container print:hidden overflow-hidden rounded-2xl border-white/10 flex-1 flex flex-col min-w-0">
    <div class="flex-1 flex gap-2 md:gap-4 overflow-x-auto p-4 md:p-6 pb-8 md:pb-10 snap-x snap-mandatory md:snap-none custom-scrollbar" cdkDropListGroup>
      @for (column of columns; track column.id) {
        <div class="flex-1 min-w-[280px] sm:min-w-[200px] flex flex-col bg-white/5 rounded-xl overflow-hidden border border-white/10 snap-center max-w-[500px]">
          <div class="bg-white/5 p-4 md:p-5 border-b border-white/10 flex items-center justify-between">
             <h3 class="font-black text-xs uppercase tracking-widest text-high-contrast">{{ column.title }}</h3>
             <span class="font-mono text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">
               {{ getOrdersByStatus(column.id).length }}
             </span>
          </div>

          <div
            cdkDropList
            [cdkDropListData]="column.id"
            (cdkDropListDropped)="drop($event)"
            class="flex-1 space-y-4 min-h-[200px] p-3 md:p-4 overflow-y-auto custom-scrollbar"
          >
            @for (order of getOrdersByStatus(column.id); track order.id) {
              <div cdkDrag [cdkDragData]="order" 
                   class="bg-white/5 p-4 md:p-6 rounded-xl border border-white/10 hover:border-orange-500/50 hover:bg-white/10 transition-all cursor-grab active:cursor-grabbing group relative backdrop-blur-sm">
                
                <div class="flex justify-between items-start mb-3 md:mb-4">
                  <span class="font-mono text-[9px] font-black tracking-tighter text-orange-500 border border-orange-500/30 px-2 py-0.5 uppercase bg-orange-500/5">
                    {{ order.customerPhone }}
                  </span>
                  <div class="flex items-center gap-2">
                    <button (click)="openPrintView(order); $event.stopPropagation()"
                            class="opacity-0 group-hover:opacity-100 text-[8px] font-black uppercase bg-white/10 text-white px-2 py-1 hover:bg-orange-600 transition-all border border-white/10">
                      Drukuj
                    </button>
                    <div class="w-2 h-2 rounded-full shadow-[0_0_10px_rgba(255,92,26,0.5)]"
                         [class.bg-red-600]="order.priority === 'high'" 
                         [class.bg-blue-500]="order.priority === 'low'"
                         [class.bg-orange-500]="order.priority === 'medium'"></div>
                  </div>
                </div>
                <h4 class="font-black text-sm uppercase mb-1 leading-none text-high-contrast group-hover:text-orange-500 transition-colors">{{ order.carModel }}</h4>
                <p class="text-[11px] text-medium-contrast font-medium line-clamp-2 leading-tight mb-2">{{ order.issueDescription }}</p>
                
                @if (order.photoUrls && order.photoUrls.length > 0) {
                  <div class="flex gap-2 mb-4">
                    @for (photoUrl of order.photoUrls.slice(0, 3); track photoUrl) {
                      <div class="w-10 h-10 rounded-lg overflow-hidden border border-white/10 flex-shrink-0">
                        <img [src]="photoUrl" class="w-full h-full object-cover">
                      </div>
                    }
                  </div>
                }
                
                <div class="flex items-center justify-between pt-3 md:pt-4 border-t border-white/10 font-mono">
                  <div class="flex flex-col">
                    <span class="text-[8px] text-white/30 font-black uppercase tracking-tighter">Termin / Klient</span>
                    <div class="flex items-center gap-2">
                       <span class="text-[10px] text-white/70 font-bold leading-none uppercase">{{ order.customerName }}</span>
                       @if (order.deadline) {
                         <span class="text-[9px] bg-white/5 border border-white/10 text-orange-500/80 px-1 pb-0.5 rounded" [class.!text-red-500]="isOverdue(order.deadline)">
                           {{ order.deadline }}
                         </span>
                       }
                    </div>
                  </div>
                  <div class="w-7 h-7 md:w-8 md:h-8 rounded-lg border border-white/10 flex items-center justify-center bg-white/5 text-[10px] font-black"
                       [class.text-red-500]="order.priority === 'high'"
                       [class.text-orange-500]="order.priority === 'medium'"
                       [class.text-blue-500]="order.priority === 'low'">
                     {{ order.customerName[0] }}
                  </div>
                </div>

                <!-- Glow effect on hover -->
                <div class="absolute inset-0 bg-orange-600/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl"></div>
              </div>
            }
          </div>
        </div>
      }
    </div>
  </div>
</div>
`,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-height: 0;
      width: 100%;
    }
    .cdk-drag-preview {
      box-shadow: 0 10px 30px rgba(0,0,0,0.5);
      background: rgba(255,255,255,0.1) !important;
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255,92,26,0.5);
      border-radius: 12px;
    }
    .cdk-drag-placeholder {
      opacity: 0.1;
      background: rgba(255,255,255,0.05);
      border: 2px dashed rgba(255,255,255,0.1);
      border-radius: 12px;
    }
    .cdk-drag-animating {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }
    .custom-scrollbar::-webkit-scrollbar {
      width: 4px;
      height: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.02);
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1);
      border-radius: 10px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(255,92,26,0.3);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardComponent {
  public orderService = inject(OrdersService);
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

  openPrintView(order: Order) {
    window.open(`/app/orders/${order.id}/print`, '_blank');
  }

  drop(event: CdkDragDrop<OrderStatus>) {
    const order = event.item.data as Order;
    const newStatus = event.container.data as OrderStatus;
    
    if (order.status !== newStatus) {
      this.orderService.updateOrderStatus(order.id, newStatus);
    }
  }

  isOverdue(deadline: string): boolean {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  }
}
