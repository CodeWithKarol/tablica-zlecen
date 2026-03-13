import { ChangeDetectionStrategy, Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrdersService, Order } from '../services/orders.service';

@Component({
  selector: 'app-client-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="h-full overflow-y-auto custom-scrollbar flex flex-col text-white pb-12 animate-in fade-in duration-500 px-4 md:px-10">
  <!-- Top Navigation / Header -->
  <div class="flex items-center justify-between mb-8 md:mb-12 border-b border-white/10 py-8">
    <div class="flex items-center gap-6">
      <a routerLink="/app/clients" class="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center hover:bg-white/10 transition-all group">
        <span class="text-2xl font-light group-hover:-translate-x-1 transition-transform">←</span>
      </a>
      <div>
        <h2 class="text-4xl font-black uppercase tracking-tighter text-high-contrast">Profil_Klienta</h2>
        <div class="flex items-center gap-3 mt-1 underline decoration-orange-500/30 underline-offset-4">
          <span class="text-[10px] text-white/30 font-mono uppercase tracking-[0.2em] font-black italic">// HISTORIA_I_STATYSTYKI</span>
        </div>
      </div>
    </div>
  </div>

  @if (client(); as c) {
    <div class="flex-col gap-10 max-w-6xl mx-auto w-full">
      <!-- Profile Header Card -->
      <div class="glass-container p-6 md:p-12 rounded-[2rem] md:rounded-[2.5rem] border-white/5 bg-white/[0.02] flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 relative overflow-hidden mb-12">
        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6 md:gap-8 relative z-10">
          <div class="w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white font-black text-3xl md:text-4xl shadow-[0_20px_40px_rgba(255,92,26,0.3)] border border-white/20">
            {{ (c.name[0] || '?') }}
          </div>
          <div>
            <h3 class="text-3xl md:text-5xl font-black uppercase text-high-contrast tracking-tighter leading-none mb-3 md:mb-4">{{ c.name || 'Anonim' }}</h3>
            <div class="flex flex-wrap gap-3 md:gap-4">
              <span class="font-mono text-[11px] md:text-sm text-orange-500 font-bold bg-orange-500/10 px-3 py-1 md:px-4 md:py-1.5 rounded-xl border border-orange-500/20 shadow-[0_0_20px_rgba(255,92,26,0.1)]">{{ c.phone }}</span>
              <span class="bg-white/5 border border-white/10 px-3 py-1 md:px-4 md:py-1.5 rounded-xl flex items-center gap-2 text-[10px] md:text-[11px] font-black uppercase text-white/40">
                <span class="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"></span>
                Status: Stały Klient
              </span>
            </div>
          </div>
        </div>

        <!-- Quick Stats Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 relative z-10 w-full xl:w-auto">
          @let stats = getClientStats(c.phone);
          <div class="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl min-w-[120px] hover:bg-white/10 transition-all md:hover:scale-105 duration-300 group">
            <p class="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 md:mb-2 group-hover:text-orange-500 transition-colors">Całkowita_Suma</p>
            <p class="text-xl md:text-2xl font-black text-high-contrast tabular-nums text-orange-500">{{ stats.total | number:'1.0-0' }} <span class="text-[10px] md:text-xs text-white/20 font-light">PLN</span></p>
          </div>
          <div class="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl min-w-[120px] hover:bg-white/10 transition-all md:hover:scale-105 duration-300 group">
            <p class="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 md:mb-2 group-hover:text-white transition-colors">Liczba_Zleceń</p>
            <p class="text-xl md:text-2xl font-black text-high-contrast tabular-nums tracking-tighter">{{ stats.count }}</p>
          </div>
          <div class="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl min-w-[120px] hover:bg-white/10 transition-all md:hover:scale-105 duration-300 group">
            <p class="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-1 md:mb-2 group-hover:text-white transition-colors">Średnia_Wartość</p>
            <p class="text-xl md:text-2xl font-black text-high-contrast tabular-nums">{{ stats.avg | number:'1.0-0' }} <span class="text-[10px] md:text-xs text-white/20 font-light">PLN</span></p>
          </div>
        </div>

        <!-- Decorative Glow -->
        <div class="absolute -top-20 -right-20 w-80 h-80 bg-orange-600/5 rounded-full blur-[120px] pointer-events-none"></div>
      </div>

      <!-- Content Grid: Timeline & Details -->
      <div class="flex flex-col gap-8 md:gap-10">
        <div class="flex items-center gap-4">
          <h4 class="font-mono text-[10px] md:text-xs uppercase text-white/20 tracking-[0.2em] md:tracking-[0.4em] font-black italic">Oś_Czasu_Współpracy</h4>
          <div class="flex-1 h-px bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>

        <div class="relative space-y-10 md:space-y-12 pb-20">
          <!-- Central Timeline Line -->
          <div class="absolute left-6 md:left-8 top-0 bottom-0 w-[1px] bg-gradient-to-b from-orange-500/50 via-white/10 to-transparent pointer-events-none"></div>

          @for (order of getClientHistory(c.phone); track order.id; let i = $index) {
            <div class="relative pl-16 md:pl-24 animate-in slide-in-from-bottom-8 duration-500" [style.animation-delay]="i * 100 + 'ms'">
              <!-- Timeline Node -->
              <div class="absolute left-4 md:left-6 top-4 w-4 h-4 md:w-5 md:h-5 rounded-full border-4 md:border-[6px] border-[#0a0a0a] z-20 shadow-[0_0_25px_rgba(255,92,26,0.3)] transition-all bg-white/20"
                   [class.bg-orange-500]="i === 0"
                   [class.ring-6]="i === 0"
                   [class.ring-orange-500/10]="i === 0">
              </div>

              <!-- Date Marker -->
              <div class="absolute left-16 md:left-24 -top-6 font-mono text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] md:tracking-[0.3em]">
                {{ order.createdAt | date:'LLLL yyyy' }}
              </div>

              <!-- Order Card -->
              <div class="glass-container p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] hover:bg-white/[0.06] hover:border-orange-500/30 transition-all group/card cursor-default relative overflow-hidden">
                <!-- Status Strip -->
                <div class="absolute right-0 top-0 bottom-0 w-1 md:w-1.5 transition-all group-hover/card:w-3"
                     [ngClass]="{
                       'bg-zinc-500': order.status === 'new',
                       'bg-blue-500': order.status === 'progress',
                       'bg-green-500': order.status === 'done',
                       'bg-orange-600': order.status === 'collected'
                     }"></div>

                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 md:gap-6 mb-6 md:mb-8">
                  <div>
                    <div class="text-xl md:text-2xl font-black text-high-contrast uppercase tracking-tighter mb-2">{{ order.carModel || 'Model Nieznany' }}</div>
                    <div class="flex items-center gap-3 md:gap-4 flex-wrap">
                      <span class="text-[10px] md:text-xs font-mono text-white/40 uppercase bg-white/5 px-2 py-0.5 md:px-3 md:py-1 rounded-lg">{{ order.createdAt | date:'dd.MM.yyyy' }}</span>
                      <span class="w-1 h-1 md:w-1.5 md:h-1.5 bg-white/10 rounded-full"></span>
                      <span class="text-[9px] md:text-[11px] font-mono text-white/30 tracking-widest">NR_{{ order.id.substring(0,8) }}</span>
                    </div>
                  </div>
                  <div class="text-left lg:text-right lg:pl-8 border-l lg:border-l-0 lg:border-r border-white/10 pr-4 md:pr-6 w-full lg:w-auto">
                    <div class="text-2xl md:text-3xl font-black text-orange-500 tabular-nums leading-none mb-1">
                      {{ ((order.laborPrice || 0) + (order.partsPrice || 0) - (order.discountPrice || 0)) | number:'1.0-2' }}
                      <span class="text-[10px] md:text-xs opacity-50 ml-1 font-bold">PLN</span>
                    </div>
                    <div class="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">Koszt_Serwisu</div>
                  </div>
                </div>

                <!-- Issue Description -->
                <div class="relative">
                  <div class="absolute -left-3 md:-left-4 top-0 bottom-0 w-1 bg-orange-500 shadow-[0_0_15px_rgba(255,92,26,0.3)]"></div>
                  <div class="text-xs md:text-sm text-medium-contrast bg-white/[0.03] p-4 md:p-6 rounded-xl md:rounded-2xl italic leading-relaxed group-hover/card:bg-white/5 transition-colors border border-white/5">
                    "{{ order.issueDescription || 'Brak opisu usterki' }}"
                  </div>
                </div>

                <div class="mt-8 flex flex-wrap gap-3">
                  <span class="text-[10px] font-black uppercase px-4 py-1.5 rounded-xl shadow-lg border border-white/5 flex items-center gap-2"
                        [ngClass]="{
                          'bg-zinc-500/10 text-zinc-400': order.status === 'new',
                          'bg-blue-500/10 text-blue-400': order.status === 'progress',
                          'bg-green-500/10 text-green-400': order.status === 'done',
                          'bg-orange-600/10 text-orange-400': order.status === 'collected'
                        }">
                    <span class="w-1.5 h-1.5 rounded-full" [class.bg-current]="true"></span>
                    {{ order.status }}
                  </span>
                  @if (order.laborPrice) {
                    <span class="text-[10px] font-black uppercase px-4 py-1.5 bg-white/5 border border-white/5 rounded-xl text-white/30 italic">+ KOSZTY_ROBOCIZNA</span>
                  }
                  @if (order.partsPrice) {
                    <span class="text-[10px] font-black uppercase px-4 py-1.5 bg-white/5 border border-white/5 rounded-xl text-white/30 italic">+ KOSZTY_CZĘŚCI</span>
                  }
                </div>
              </div>
            </div>
          } @empty {
            <div class="text-center py-24 bg-white/[0.02] rounded-[3rem] border border-dashed border-white/10">
              <div class="text-4xl mb-4 opacity-20">📂</div>
              <p class="font-mono text-xs uppercase text-white/20 tracking-widest font-black">Brak_Historii_Zleceń_Dla_Tego_Klienta</p>
            </div>
          }
        </div>
      </div>
    </div>
  } @else {
    <div class="flex items-center justify-center py-20">
      <div class="text-center animate-pulse">
        <div class="text-6xl mb-6">🔍</div>
        <p class="font-mono text-sm uppercase text-white/20 tracking-widest font-black leading-loose">
          ŁADOWANIE_DANYCH_PROFILU...<br>
          <span class="text-[10px] opacity-40 font-normal">// TRWA_WYSZUKIWANIE_W_BAZIE</span>
        </p>
      </div>
    </div>
  }
</div>
`,
  styles: [`
    :host {
      display: block;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientDetailComponent {
  private orderService = inject(OrdersService);
  private route = inject(ActivatedRoute);
  
  public phone = computed(() => this.route.snapshot.paramMap.get('phone') || '');

  public client = computed(() => {
    const phone = this.phone();
    const orders = this.orderService.orders();
    const clientOrders = orders.filter(o => o.customerPhone === phone);
    
    if (clientOrders.length === 0) return null;

    // Sort by date to get most recent info
    const sorted = [...clientOrders].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    const latest = sorted[0];

    return {
      name: latest.customerName,
      phone: latest.customerPhone
    };
  });

  public getClientHistory(phone: string) {
    return this.orderService.orders().filter(o => o.customerPhone === phone)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  public getClientStats(phone: string) {
    const history = this.getClientHistory(phone);
    const total = history.reduce((sum, o) => sum + (Number(o.laborPrice) || 0) + (Number(o.partsPrice) || 0) - (Number(o.discountPrice) || 0), 0);
    const count = history.length;
    const avg = count > 0 ? total / count : 0;
    return { 
      total: Number(total.toFixed(2)), 
      count, 
      avg: Number(avg.toFixed(2)) 
    };
  }
}
