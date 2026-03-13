import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { OrdersService, Order } from '../services/orders.service';

interface ClientEntry {
  name: string;
  phone: string;
  orderCount: number;
  lastOrderDate: Date;
  lastCar: string;
}

@Component({
  selector: 'app-client-list',
  standalone: true,
  imports: [CommonModule],
  template: `
<div class="h-full flex flex-col text-white">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 border-b border-white/10 pb-8 gap-6">
    <div>
      <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-high-contrast">Baza_Klientów</h2>
      <div class="flex items-center gap-4 mt-2 font-mono text-[10px] uppercase">
        <span class="text-orange-500 font-bold">[AKTYWNI: {{ clients().length }}]</span>
        <span class="text-white/40 hidden sm:inline">// HISTORIA_WSZYSTKICH_RELACJI</span>
      </div>
    </div>

    <div class="flex-1 w-full md:max-w-md md:pl-12">
      <div class="relative">
        <input 
          type="text" 
          (input)="searchQuery.set($any($event.target).value)"
          placeholder="Szukaj po nazwie lub telefonie..." 
          class="w-full bg-white/5 border border-white/10 px-10 py-4 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all text-sm text-white placeholder:text-white/20"
        >
        <div class="absolute left-4 top-1/2 -translate-y-1/2 text-white/20">🔍</div>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="glass-container overflow-hidden rounded-2xl border-white/10 flex-1 flex flex-col min-w-0">
    <div class="overflow-x-auto custom-scrollbar overflow-y-auto">
      <table class="w-full text-left border-collapse min-w-[800px] md:min-w-0">
        <thead>
          <tr class="bg-white/5 border-b border-white/10 font-mono text-[10px] uppercase tracking-widest text-white/50">
            <th class="px-6 py-4 border-r border-white/10">Klient_ID / Dane</th>
            <th class="px-6 py-4 border-r border-white/10">Telefon</th>
            <th class="px-6 py-4 border-r border-white/10">Ostatni_Pojazd</th>
            <th class="px-6 py-4 border-r border-white/10 text-center hidden md:table-cell">Zlecenia</th>
            <th class="px-6 py-4 pr-12 hidden lg:table-cell">Ostatni_Kontakt</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          @for (client of filteredClients(); track client.phone + client.name) {
            <tr (click)="openClientDetail(client.phone)" 
                class="hover:bg-white/5 transition-colors group cursor-pointer">
              <td class="px-6 py-6 border-r border-white/10">
                <div class="flex items-center gap-4">
                  <div class="w-10 h-10 bg-white/5 flex items-center justify-center text-orange-500 font-mono text-xs border border-white/10 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-all">
                    {{ client.name[0] }}
                  </div>
                  <div class="font-black text-sm uppercase tracking-tight text-high-contrast">{{ client.name }}</div>
                </div>
              </td>
              <td class="px-6 py-6 border-r border-white/10 font-mono text-xs font-bold text-medium-contrast">
                {{ client.phone }}
              </td>
              <td class="px-6 py-6 border-r border-white/10">
                <span class="text-[11px] font-black uppercase bg-white/5 px-2 py-1 border border-white/10 rounded text-medium-contrast">
                  {{ client.lastCar }}
                </span>
              </td>
              <td class="px-6 py-6 border-r border-white/10 text-center hidden md:table-cell">
                <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/5 border border-white/10 font-mono text-[10px] font-black text-orange-500">
                  {{ client.orderCount }}
                </div>
              </td>
              <td class="px-6 py-6 font-mono text-[10px] text-white/30 uppercase pr-12 hidden lg:table-cell">
                {{ client.lastOrderDate | date:'yyyy-MM-dd HH:mm' }}
              </td>
            </tr>
          }
 @empty {
            <tr>
              <td colspan="5" class="px-6 py-20 text-center">
                <div class="font-mono text-xs text-white/20 uppercase tracking-widest">Brak danych do wyświetlenia</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
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
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientListComponent {
  private orderService = inject(OrdersService);
  private router = inject(Router);
  public searchQuery = signal('');

  public openClientDetail(phone: string) {
    this.router.navigate(['/app/clients', phone]);
  }

  public clients = computed(() => {
    const orders = this.orderService.orders();
    const clientMap = new Map<string, ClientEntry>();

    orders.forEach(order => {
      const key = `${order.customerPhone}_${order.customerName}`;
      const existing = clientMap.get(key);

      if (!existing) {
        clientMap.set(key, {
          name: order.customerName,
          phone: order.customerPhone,
          orderCount: 1,
          lastOrderDate: new Date(order.createdAt),
          lastCar: order.carModel
        });
      } else {
        existing.orderCount++;
        if (new Date(order.createdAt) > existing.lastOrderDate) {
          existing.lastOrderDate = new Date(order.createdAt);
          existing.lastCar = order.carModel;
        }
      }
    });

    return Array.from(clientMap.values()).sort((a, b) => b.lastOrderDate.getTime() - a.lastOrderDate.getTime());
  });

  public filteredClients = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const clientsList = this.clients();
    if (!query) return clientsList;

    return clientsList.filter(client => 
      client.name.toLowerCase().includes(query) ||
      client.phone.includes(query) ||
      client.lastCar.toLowerCase().includes(query)
    );
  });
}
