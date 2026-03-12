import { ChangeDetectionStrategy, Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
<div class="flex-1 flex flex-col text-white px-4 md:px-0">
  <!-- Header -->
  <div class="mb-12 border-b border-white/10 pb-8">
    <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-high-contrast">Dashboard_System</h2>
    <div class="flex items-center gap-4 mt-2 font-mono text-[10px] uppercase">
      <span class="text-orange-500 font-bold">[SESJA: AKTYWNA]</span>
      <span class="text-white/40 hidden sm:inline">// STATUS_WARSZTATU: OPERACYJNY</span>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    <!-- New Orders -->
    <div class="glass-container p-8 border border-white/10 relative overflow-hidden group hover:border-orange-500/50 transition-all">
      <div class="relative z-10">
        <p class="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Nowe_Zlecenia</p>
        <h3 class="text-5xl font-black text-white tabular-nums">{{ stats().new }}</h3>
      </div>
      <div class="absolute top-0 right-0 p-4 font-mono text-[40px] font-black text-white/[0.03] select-none group-hover:text-orange-500/10 transition-colors">01</div>
    </div>

    <!-- In Progress -->
    <div class="glass-container p-8 border border-white/10 relative overflow-hidden group hover:border-blue-500/50 transition-all">
      <div class="relative z-10">
        <p class="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">W_Toku</p>
        <h3 class="text-5xl font-black text-white tabular-nums">{{ stats().progress }}</h3>
      </div>
      <div class="absolute top-0 right-0 p-4 font-mono text-[40px] font-black text-white/[0.03] select-none group-hover:text-blue-500/10 transition-colors">02</div>
    </div>

    <!-- Ready for Pickup -->
    <div class="glass-container p-8 border border-white/10 relative overflow-hidden group hover:border-green-500/50 transition-all">
      <div class="relative z-10">
        <p class="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Do_Odbioru</p>
        <h3 class="text-5xl font-black text-white tabular-nums">{{ stats().done }}</h3>
      </div>
      <div class="absolute top-0 right-0 p-4 font-mono text-[40px] font-black text-white/[0.03] select-none group-hover:text-green-500/10 transition-colors">03</div>
    </div>

    <!-- Overdue -->
    <div class="glass-container p-8 border border-white/20 bg-red-600/[0.03] relative overflow-hidden group hover:border-red-500/50 transition-all">
      <div class="relative z-10">
        <p class="text-[10px] font-black uppercase tracking-widest text-red-500/60 mb-1">Po_Terminie</p>
        <h3 class="text-5xl font-black text-red-500 tabular-nums">{{ stats().overdue }}</h3>
      </div>
      <div class="absolute top-0 right-0 p-4 font-mono text-[40px] font-black text-red-500/[0.05] select-none group-hover:text-red-500/20 transition-colors">!!</div>
    </div>
  </div>

  <!-- Quick Actions -->
  <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 mt-4">
    <div class="lg:col-span-2">
      <h4 class="font-black text-xs uppercase tracking-widest text-white/30 mb-6 flex items-center gap-3">
        Szybki_Start <span class="w-12 h-px bg-white/10"></span>
      </h4>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a routerLink="/app/orders/new" class="bg-neon-orange hover:bg-orange-600 p-6 rounded-2xl flex items-center justify-between group transition-all">
          <span class="font-black uppercase text-xs tracking-widest">Dodaj Nowe Zlecenie</span>
          <span class="text-xl group-hover:translate-x-1 transition-transform">→</span>
        </a>
        <a routerLink="/app/board" class="bg-white/5 hover:bg-white/10 border border-white/10 p-6 rounded-2xl flex items-center justify-between group transition-all">
          <span class="font-black uppercase text-xs tracking-widest">Otwórz Tablicę Kanban</span>
          <span class="text-xl group-hover:translate-x-1 transition-transform">→</span>
        </a>
      </div>
    </div>

    <!-- Info Panel -->
    <div class="glass-container p-8 border border-white/10">
      <h4 class="font-black text-xs uppercase tracking-widest text-orange-500 mb-6">Powiadomienie_Systemowe</h4>
      <p class="text-xs text-white/60 leading-relaxed font-mono">
        Wszystkie systemy operacyjne. RLS aktywny. Izolacja danych włączona. 
        Auto-powiadomienia zostaną wysłane przy zmianie statusu na [GOTOWE].
      </p>
      <div class="mt-8 pt-8 border-t border-white/5">
        <div class="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-white/30">
          <span>Ostatnia_Aktywność:</span>
          <span class="text-white/60">{{ lastUpdate() | date:'HH:mm:ss' }}</span>
        </div>
      </div>
    </div>
  </div>
</div>
`,
  styles: [`
    :host { display: block; height: 100%; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private orderService = inject(OrdersService);

  readonly stats = computed(() => {
    const orders = this.orderService.orders();
    const now = new Date();
    
    return {
      new: orders.filter(o => o.status === 'new').length,
      progress: orders.filter(o => o.status === 'progress').length,
      done: orders.filter(o => o.status === 'done').length,
      overdue: orders.filter(o => {
        if (!o.deadline || o.status === 'done' || o.status === 'collected') return false;
        return new Date(o.deadline) < now;
      }).length
    };
  });

  readonly lastUpdate = signal(new Date());

  constructor() {
    // Refresh the "last update" indicator when orders change
    this.orderService.orders(); // React locally if needed, though computed handles the UI
  }
}
