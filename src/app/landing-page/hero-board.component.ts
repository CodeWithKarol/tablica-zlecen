import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-[#0a0a0a] border border-white/10 overflow-hidden w-full relative group/board font-sans select-none shadow-2xl">
      <!-- Pasek Górny Urządzenia -->
      <div class="bg-white/5 p-3 border-b border-white/10 flex items-center justify-between">
        <div class="flex gap-1.5">
          <div class="w-2 h-2 rounded-full bg-red-500/20 border border-red-500/40"></div>
          <div class="w-2 h-2 rounded-full bg-orange-500/20 border border-orange-500/40 animate-pulse"></div>
          <div class="w-2 h-2 rounded-full bg-green-500/20 border border-green-500/40"></div>
        </div>
        <div class="flex items-center gap-4">
          <span class="text-[8px] font-black uppercase tracking-[0.3em] text-white/30">System_Warsztatu v1.0.2</span>
          <div class="h-4 w-[1px] bg-white/10"></div>
          <span class="text-[8px] font-mono text-orange-500/80">POŁĄCZENIE: AKTYWNE</span>
        </div>
      </div>

      <!-- Treść Tablicy -->
      <div class="p-4 grid grid-cols-3 gap-4 bg-gradient-to-b from-[#0a0a0a] to-[#050505] min-h-[380px]">
        
        <!-- NOWE -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between mb-1 px-1">
            <h3 class="text-[9px] font-black text-white/40 uppercase tracking-widest">Nowe</h3>
            <span class="text-[8px] font-mono text-white/20 bg-white/5 px-1.5 py-0.5 rounded">{{ newOrders().length }}</span>
          </div>
          <div class="space-y-3">
             @for (order of newOrders(); track order.id) {
               <div (click)="moveToProgress(order)" 
                    class="group/card cursor-pointer transform hover:-translate-y-1 transition-all duration-500">
                  <div class="p-3 bg-white/[0.03] border border-white/10 rounded-xl hover:border-orange-500/50 hover:bg-white/[0.05] transition-all relative overflow-hidden backdrop-blur-sm">
                    <div class="flex items-center justify-between mb-2">
                       <span class="text-[7px] font-mono font-black px-1.5 py-0.5 bg-orange-500/10 text-orange-500 rounded uppercase border border-orange-500/20">{{ order.plate }}</span>
                       <span class="text-[10px] opacity-40 group-hover/card:opacity-100 transition-opacity">🔧</span>
                    </div>
                    <p class="text-[10px] font-bold text-white/90 leading-none mb-1">{{ order.car }}</p>
                    <p class="text-[8px] text-white/40 font-medium line-clamp-1">{{ order.issue }}</p>
                  </div>
               </div>
             }
          </div>
        </div>

        <!-- W TOKU -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between mb-1 px-1">
            <h3 class="text-[9px] font-black text-orange-500 uppercase tracking-widest">W toku</h3>
            <span class="text-[8px] font-mono text-orange-500 bg-orange-500/10 px-1.5 py-0.5 rounded">{{ inProgressOrders().length }}</span>
          </div>
          <div class="space-y-3">
             @for (order of inProgressOrders(); track order.id) {
               <div (click)="moveToDone(order)" 
                    class="group/card cursor-pointer transform hover:-translate-y-1 transition-all duration-500">
                  <div class="p-3 bg-orange-500/[0.02] border border-orange-500/30 rounded-xl hover:border-orange-500 hover:bg-orange-500/10 transition-all relative overflow-hidden backdrop-blur-md">
                    <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-scan"></div>
                    <div class="flex items-center justify-between mb-2">
                       <span class="text-[7px] font-mono font-black px-1.5 py-0.5 bg-orange-500 text-black rounded uppercase">{{ order.plate }}</span>
                       <span class="animate-pulse text-[10px]">⚡</span>
                    </div>
                    <p class="text-[10px] font-bold text-white leading-none mb-1">{{ order.car }}</p>
                    
                    <div class="mt-3 w-full h-0.5 bg-white/5 rounded-full overflow-hidden">
                       <div class="h-full bg-orange-500 w-[65%] animate-pulse-width"></div>
                    </div>
                  </div>
               </div>
             } @empty {
               <div class="h-24 border border-dashed border-white/5 rounded-xl flex flex-col items-center justify-center gap-2">
                  <span class="text-xs opacity-10">🖱️</span>
                  <p class="text-[7px] text-white/10 font-bold uppercase tracking-tighter">Przeciągnij_Tutaj</p>
               </div>
             }
          </div>
        </div>

        <!-- GOTOWE -->
        <div class="flex flex-col gap-3">
          <div class="flex items-center justify-between mb-1 px-1">
            <h3 class="text-[9px] font-black text-white/20 uppercase tracking-widest">Gotowe</h3>
            <span class="text-[8px] font-mono text-white/10 bg-white/5 px-1.5 py-0.5 rounded">{{ doneOrders().length }}</span>
          </div>
          <div class="space-y-3">
             @for (order of doneOrders(); track order.id) {
               <div class="opacity-30 grayscale group/card transition-all duration-700">
                  <div class="p-3 bg-white/[0.02] border border-white/5 rounded-xl">
                    <div class="flex items-center justify-between mb-2">
                       <span class="text-[7px] font-mono px-1.5 py-0.5 bg-white/5 text-white/40 rounded uppercase">{{ order.plate }}</span>
                       <span class="text-green-500/50 text-[10px]">✓</span>
                    </div>
                    <p class="text-[10px] font-bold text-white/40 line-through">{{ order.car }}</p>
                    <div class="mt-3 flex items-center gap-1.5">
                       <div class="w-1 h-1 rounded-full bg-green-500 animate-pulse"></div>
                       <span class="text-[6px] font-mono uppercase text-green-500/60">SMS_DOSTARCZONY</span>
                    </div>
                  </div>
               </div>
             }
          </div>
        </div>
      </div>

      <!-- Komunikat Automatyzacji -->
      @if (showBubble()) {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-in fade-in duration-500">
           <div class="bg-[#111] border border-orange-500/50 p-6 rounded-2xl shadow-[0_0_50px_rgba(255,77,0,0.2)] flex flex-col items-center text-center gap-3 transform animate-in zoom-in-95">
              <div class="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,77,0,0.5)]">
                <span class="text-black font-black">!</span>
              </div>
              <div>
                <h4 class="text-[10px] font-black uppercase tracking-widest text-white">Automatyzacja Wyzwolona</h4>
                <p class="text-[8px] font-mono text-orange-500/70 mt-1">STATUS: SMS_WYSŁANY_DO_KLIENTA</p>
              </div>
              <div class="w-32 h-1 bg-white/5 rounded-full overflow-hidden mt-2">
                 <div class="h-full bg-orange-500 animate-progress-timer"></div>
              </div>
           </div>
        </div>
      }

      <!-- Dekoracja Techniczna w Tle -->
      <div class="absolute -bottom-10 -right-10 w-40 h-40 bg-orange-600/5 rounded-full blur-3xl pointer-events-none"></div>
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
      0%, 100% { width: 65%; opacity: 0.8; }
      50% { width: 70%; opacity: 1; }
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
