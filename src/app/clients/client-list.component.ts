import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
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
<div class="h-full flex flex-col">
  <!-- Header -->
  <div class="flex items-end justify-between mb-12 border-b-2 border-black pb-8">
    <div>
      <h2 class="text-5xl font-black uppercase tracking-tighter">Baza_Klientów</h2>
      <div class="flex items-center gap-4 mt-2 font-mono text-[10px] uppercase">
        <span class="text-orange-600 font-bold">[STATUS: SYNCED]</span>
        <span class="text-zinc-400">// ANALIZA_RELACJI: {{ clients().length }} UNIKALNYCH_OBIEKTÓW</span>
      </div>
    </div>

    <div class="flex-1 max-w-md mx-12 mb-1">
      <div class="relative">
        <input 
          type="text" 
          (input)="searchQuery.set($any($event.target).value)"
          placeholder="SZUKAJ_KLIENTA..." 
          class="w-full bg-zinc-50 border border-black px-4 py-3 font-mono text-[11px] uppercase focus:outline-none focus:bg-white focus:border-orange-600 transition-none placeholder:text-zinc-400"
        />
        <div class="absolute -top-2 left-3 bg-black text-white text-[8px] px-1.5 py-0.5 font-mono uppercase tracking-widest pointer-events-none">
          FILTR_WYSZUKIWANIA
        </div>
      </div>
    </div>
  </div>

  <!-- Table -->
  <div class="border border-black bg-white overflow-hidden">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-zinc-100 border-b border-black font-mono text-[10px] uppercase tracking-widest">
          <th class="px-6 py-4 border-r border-black">Klient_ID / Dane</th>
          <th class="px-6 py-4 border-r border-black">Telefon</th>
          <th class="px-6 py-4 border-r border-black">Ostatni_Pojazd</th>
          <th class="px-6 py-4 border-r border-black text-center">Zlecenia</th>
          <th class="px-6 py-4">Ostatni_Kontakt</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-black">
        @for (client of filteredClients(); track client.phone + client.name) {
          <tr class="hover:bg-zinc-50 transition-none group">
            <td class="px-6 py-6 border-r border-black">
              <div class="flex items-center gap-4">
                <div class="w-10 h-10 bg-black flex items-center justify-center text-white font-mono text-xs border border-black group-hover:bg-orange-600 transition-none">
                  {{ client.name[0] }}
                </div>
                <div class="font-black text-sm uppercase tracking-tight">{{ client.name }}</div>
              </div>
            </td>
            <td class="px-6 py-6 border-r border-black font-mono text-xs font-bold text-zinc-600">
              {{ client.phone }}
            </td>
            <td class="px-6 py-6 border-r border-black">
              <span class="text-[11px] font-black uppercase bg-zinc-100 px-2 py-1 border border-black/10">
                {{ client.lastCar }}
              </span>
            </td>
            <td class="px-6 py-6 border-r border-black text-center">
              <div class="inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 border border-black font-mono text-[10px] font-black">
                {{ client.orderCount }}
              </div>
            </td>
            <td class="px-6 py-6 font-mono text-[10px] text-zinc-500 uppercase">
              {{ client.lastOrderDate | date:'yyyy-MM-dd HH:mm' }}
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="5" class="px-6 py-20 text-center">
              <div class="font-mono text-xs text-zinc-400 uppercase tracking-widest">Brak danych do wyświetlenia</div>
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>
</div>
`,
  styles: [`
    :host { display: block; height: 100%; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientListComponent {
  private orderService = inject(OrdersService);
  public searchQuery = signal('');

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
