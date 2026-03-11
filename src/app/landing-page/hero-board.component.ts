import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#0a0a0a] border border-white/20 overflow-hidden w-full relative group/board font-sans select-none shadow-2xl">
      <!-- Pasek Górny Urządzenia -->
      <div class="bg-white/10 p-3 border-b border-white/10 flex items-center justify-between">
        <div class="flex gap-1.5">
          <div class="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/60"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-orange-500/40 border border-orange-500/60 animate-pulse"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-green-500/40 border border-green-500/60"></div>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-[9px] font-black uppercase tracking-[0.3em] text-white/50">System_Warsztatu v1.0.2</span>
          <div class="h-4 w-[1px] bg-white/20"></div>
          <span class="text-[9px] font-mono text-orange-500 font-bold">POŁĄCZENIE: AKTYWNE</span>
        </div>
      </div>

      <!-- Treść Tablicy -->
      <div class="p-4 grid grid-cols-3 gap-4 bg-gradient-to-b from-[#0a0a0a] to-[#050505] min-h-[380px]">
        
        <!-- NOWE -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between mb-1 px-1 border-b border-white/5 pb-2">
            <h3 class="text-[10px] font-black text-white/60 uppercase tracking-widest">Nowe</h3>
            <span class="text-[9px] font-mono text-white/40 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">{{ newOrders().length }}</span>
          </div>
          <div class="space-y-3">
             @for (order of newOrders(); track order.id) {
               <div (click)="moveToProgress(order)" 
                    class="group/card cursor-pointer transform hover:-translate-y-1 transition-all duration-500">
                  <div class="p-3 bg-white/[0.05] border border-white/15 rounded-xl hover:border-orange-500/60 hover:bg-white/[0.08] transition-all relative overflow-hidden backdrop-blur-sm shadow-lg">
                    <div class="flex items-center justify-between mb-2">
                       <span class="text-[8px] font-mono font-black px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded uppercase border border-orange-500/30">{{ order.plate }}</span>
                       <span class="text-[11px] opacity-60 group-hover/card:opacity-100 transition-opacity">🔧</span>
                    </div>
                    <p class="text-[11px] font-bold text-white leading-none mb-1">{{ order.car }}</p>
                    <p class="text-[9px] text-white/50 font-medium line-clamp-1">{{ order.issue }}</p>
                  </div>
               </div>
             }
          </div>
        </div>

        <!-- W TOKU -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between mb-1 px-1 border-b border-orange-500/20 pb-2">
            <h3 class="text-[10px] font-black text-orange-500 uppercase tracking-widest">W toku</h3>
            <span class="text-[9px] font-mono text-orange-500 bg-orange-500/20 px-1.5 py-0.5 rounded border border-orange-500/30 font-bold">{{ inProgressOrders().length }}</span>
          </div>
          <div class="space-y-3">
             @for (order of inProgressOrders(); track order.id) {
               <div (click)="moveToDone(order)" 
                    class="group/card cursor-pointer transform hover:-translate-y-1 transition-all duration-500">
                  <div class="p-3 bg-orange-500/[0.05] border border-orange-500/40 rounded-xl hover:border-orange-500 hover:bg-orange-500/10 transition-all relative overflow-hidden backdrop-blur-md shadow-[0_0_20px_rgba(255,92,26,0.1)]">
                    <div class="absolute top-0 left-0 w-full h-[1.5px] bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-scan"></div>
                    <div class="flex items-center justify-between mb-2">
                       <span class="text-[8px] font-mono font-black px-1.5 py-0.5 bg-orange-500 text-black rounded uppercase shadow-sm">{{ order.plate }}</span>
                       <span class="animate-pulse text-[11px]">⚡</span>
                    </div>
                    <p class="text-[11px] font-bold text-white leading-none mb-1">{{ order.car }}</p>
                    
                    <div class="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden border border-white/5">
                       <div class="h-full bg-orange-500 w-[65%] animate-pulse-width shadow-[0_0_10px_rgba(255,92,26,0.5)]"></div>
                    </div>
                  </div>
               </div>
             } @empty {
               <div class="h-24 border border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 bg-white/[0.02]">
                  <span class="text-sm opacity-20">🖱️</span>
                  <p class="text-[8px] text-white/30 font-bold uppercase tracking-tighter">Przeciągnij_Tutaj</p>
               </div>
             }
          </div>
        </div>

        <!-- GOTOWE -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between mb-1 px-1 border-b border-white/5 pb-2">
            <h3 class="text-[10px] font-black text-white/40 uppercase tracking-widest">Gotowe</h3>
            <span class="text-[9px] font-mono text-white/30 bg-white/10 px-1.5 py-0.5 rounded border border-white/10">{{ doneOrders().length }}</span>
          </div>
          <div class="space-y-3">
             @for (order of doneOrders(); track order.id) {
               <div class="opacity-50 grayscale group/card transition-all duration-700">
                  <div class="p-3 bg-white/[0.03] border border-white/10 rounded-xl">
                    <div class="flex items-center justify-between mb-2">
                       <span class="text-[8px] font-mono px-1.5 py-0.5 bg-white/10 text-white/60 rounded uppercase">{{ order.plate }}</span>
                       <span class="text-green-500 text-[11px]">✓</span>
                    </div>
                    <p class="text-[11px] font-bold text-white/60 line-through decoration-orange-500/50">{{ order.car }}</p>
                    <div class="mt-3 flex items-center gap-1.5">
                       <div class="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.5)]"></div>
                       <span class="text-[7px] font-mono font-bold uppercase text-green-500/80">SMS_DOSTARCZONY</span>
                    </div>
                  </div>
               </div>
             }
          </div>
        </div>
      </div>

      <!-- Komunikat Automatyzacji -->
      @if (showBubble()) {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-500">
           <div class="bg-[#111] border-2 border-orange-500 p-8 rounded-2xl shadow-[0_0_60px_rgba(255,77,0,0.3)] flex flex-col items-center text-center gap-4 transform animate-in zoom-in-95">
              <div class="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,77,0,0.6)]">
                <span class="text-black font-black text-xl">!</span>
              </div>
              <div>
                <h4 class="text-[12px] font-black uppercase tracking-[0.2em] text-white">Automatyzacja Wyzwolona</h4>
                <p class="text-[10px] font-mono text-orange-400 font-bold mt-2">STATUS: SMS_WYSŁANY_DO_KLIENTA</p>
              </div>
              <div class="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden mt-2 border border-white/5">
                 <div class="h-full bg-orange-500 animate-progress-timer shadow-[0_0_10px_rgba(255,92,26,0.5)]"></div>
              </div>
           </div>
        </div>
      }

      <!-- Dekoracja Techniczna w Tle -->
      <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-600/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    @keyframes scan {
      from { transform: translateX(-100%); }
      to { transform: translateX(100%); }
    }
    @keyframes progress-timer {
      from { width: 100%; }
      to { width: 0%; }
    }
    @keyframes pulse-width {
      0%, 100% { width: 65%; opacity: 0.9; }
      50% { width: 72%; opacity: 1; }
    }
    .animate-scan {
      animation: scan 3s linear infinite;
    }
    .animate-progress-timer {
      animation: progress-timer 3s linear forwards;
    }
    .animate-pulse-width {
      animation: pulse-width 2s ease-in-out infinite;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBoardComponent {
  orders = signal([
    { id: 1, car: 'VW Golf GTI', plate: 'KR 777GT', client: 'Marek Nowak', issue: 'Tuning silnika Stage 1', status: 'new' },
    { id: 2, car: 'Tesla Model S', plate: 'WA 123EV', client: 'Ewa Kowalska', issue: 'Diagnostyka baterii', status: 'progress' },
  ]);

  showBubble = signal(false);

  newOrders = computed(() => this.orders().filter(o => o.status === 'new'));
  inProgressOrders = computed(() => this.orders().filter(o => o.status === 'progress'));
  doneOrders = computed(() => this.orders().filter(o => o.status === 'done'));

  moveToProgress(order: any) {
    this.orders.update(prev => prev.map(o => o.id === order.id ? { ...o, status: 'progress' } : o));
  }

  moveToDone(order: any) {
    this.orders.update(prev => prev.map(o => o.id === order.id ? { ...o, status: 'done' } : o));
    this.triggerWebhookEffect();
  }

  triggerWebhookEffect() {
    this.showBubble.set(true);
    setTimeout(() => this.showBubble.set(false), 3000);
  }
}
