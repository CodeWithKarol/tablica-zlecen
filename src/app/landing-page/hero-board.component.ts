import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden max-w-lg mx-auto relative group/board">
      <!-- Top Bar Mockup -->
      <div class="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
        <div class="flex gap-2">
          <div class="w-2.5 h-2.5 rounded-full bg-red-400/20 border border-red-400/30"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-yellow-400/20 border border-yellow-400/30"></div>
          <div class="w-2.5 h-2.5 rounded-full bg-green-400/20 border border-green-400/30"></div>
        </div>
        <div class="flex items-center gap-4">
          <div class="hidden sm:flex items-center gap-2 px-3 py-1 bg-white border border-slate-200 rounded-md text-[8px] text-slate-400 font-bold">
             <span>🔍</span> Szukaj zlecenia...
          </div>
          <span class="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">Podgląd Tablicy</span>
        </div>
      </div>

      <!-- Board Content -->
      <div class="p-6 grid grid-cols-3 gap-5 bg-slate-50/30 min-h-[420px]">
        <!-- New Column -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between mb-1 px-1">
            <h3 class="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nowe</h3>
            <span class="text-[9px] font-bold text-slate-300 bg-slate-100 px-1.5 py-0.5 rounded">{{ newOrders().length }}</span>
          </div>
          <div class="space-y-4">
             @for (order of newOrders(); track order.id) {
               <div (click)="moveToProgress(order)" 
                    class="group cursor-pointer transform hover:-translate-y-1 hover:rotate-1 transition-all duration-300 active:scale-95">
                  <div class="p-4 bg-white rounded-2xl border border-slate-200 hover:border-primary-400 shadow-sm hover:shadow-md transition-all relative overflow-hidden">
                    <div class="flex items-center justify-between mb-3">
                       <span class="text-[8px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded uppercase tracking-tighter">{{ order.plate }}</span>
                       <span class="text-[14px]">🔧</span>
                    </div>
                    <p class="text-xs font-bold text-slate-900 leading-none mb-1">{{ order.car }}</p>
                    <p class="text-[9px] text-slate-400 font-medium mb-3">{{ order.issue }}</p>
                    <div class="flex items-center justify-between pt-3 border-t border-slate-50">
                       <span class="text-[8px] font-black text-slate-300 uppercase italic">{{ order.client }}</span>
                       <div class="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[7px] font-black text-slate-400">AN</div>
                    </div>
                  </div>
               </div>
             }
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between mb-1 px-1">
            <h3 class="text-[10px] font-black text-primary-600 uppercase tracking-widest">W toku</h3>
            <span class="text-[9px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">{{ inProgressOrders().length }}</span>
          </div>
          <div class="space-y-4">
             @for (order of inProgressOrders(); track order.id) {
               <div (click)="moveToDone(order)" 
                    class="group cursor-pointer transform hover:-translate-y-1 hover:-rotate-1 transition-all duration-300 active:scale-95">
                  <div class="p-4 bg-primary-50/50 rounded-2xl border border-primary-100 hover:border-primary-300 shadow-sm relative overflow-hidden transition-all">
                    <div class="flex items-center justify-between mb-3">
                       <span class="text-[8px] font-bold px-1.5 py-0.5 bg-primary-600 text-white rounded uppercase tracking-tighter">{{ order.plate }}</span>
                       <span class="animate-pulse text-[14px]">⚡</span>
                    </div>
                    <p class="text-xs font-bold text-slate-900 leading-none mb-1">{{ order.car }}</p>
                    <p class="text-[9px] text-primary-700/70 font-medium mb-3">{{ order.issue }}</p>
                    
                    <!-- Execution Bar -->
                    <div class="w-full h-1 bg-primary-100 rounded-full overflow-hidden mb-3">
                       <div class="h-full bg-primary-500 w-[60%] animate-pulse"></div>
                    </div>

                    <div class="flex items-center justify-between pt-3 border-t border-primary-100/50">
                       <span class="text-[8px] font-black text-primary-600 uppercase italic">{{ order.client }}</span>
                       <div class="w-5 h-5 rounded-full bg-primary-600 text-white flex items-center justify-center text-[7px] font-black">JK</div>
                    </div>
                  </div>
               </div>
             } @empty {
               <div class="h-32 border-2 border-dashed border-slate-100 rounded-2xl flex flex-col items-center justify-center gap-2 group-hover/board:border-primary-200 transition-colors">
                  <span class="text-xl opacity-20">🖱️</span>
                  <p class="text-[9px] text-slate-300 font-bold uppercase tracking-tighter">Przeciągnij tutaj</p>
               </div>
             }
          </div>
        </div>

        <!-- Done Column -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between mb-1 px-1">
            <h3 class="text-[10px] font-black text-slate-300 uppercase tracking-widest">Gotowe</h3>
            <span class="text-[9px] font-bold text-slate-200 bg-slate-50 px-1.5 py-0.5 rounded">{{ doneOrders().length }}</span>
          </div>
          <div class="space-y-4">
             @for (order of doneOrders(); track order.id) {
               <div class="opacity-40 grayscale group transition-all duration-500 scale-95 origin-top">
                  <div class="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm relative">
                    <div class="flex items-center justify-between mb-3">
                       <span class="text-[8px] font-bold px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded uppercase tracking-tighter">{{ order.plate }}</span>
                       <span class="text-green-500 text-[14px]">✓</span>
                    </div>
                    <p class="text-xs font-bold text-slate-900 line-through decoration-slate-300">{{ order.car }}</p>
                    <div class="mt-4 flex flex-col gap-1">
                       <p class="text-[9px] text-primary-600 font-black uppercase tracking-tighter flex items-center gap-1">
                          <span class="w-1.5 h-1.5 bg-primary-600 rounded-full"></span> SMS Wysłany
                       </p>
                       <span class="text-[7px] text-slate-400">14:20 - Make.com Hook</span>
                    </div>
                  </div>
               </div>
             }
          </div>
        </div>
      </div>

      <!-- Feedback Bubble (Improved) -->
      @if (showBubble()) {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-white/20 backdrop-blur-[2px] animate-in fade-in duration-300">
           <div class="bg-slate-900 text-white px-8 py-5 rounded-[2rem] shadow-2xl flex flex-col items-center text-center gap-2 border border-slate-800 transform animate-in zoom-in-95 duration-300">
              <div class="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-2xl shadow-lg shadow-primary-500/40 mb-2">⚡</div>
              <h4 class="text-xs font-black uppercase tracking-widest text-primary-400">Webhook Wyzwolony!</h4>
              <p class="text-[10px] font-medium text-slate-400 max-w-[150px]">Dane przesłane do Twojej automatyzacji n8n/Make</p>
              <div class="mt-4 w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                 <div class="h-full bg-primary-500 animate-[loading_4s_linear]"></div>
              </div>
           </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      user-select: none;
    }
    @keyframes loading {
      from { width: 0%; }
      to { width: 100%; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroBoardComponent {
  orders = signal([
    { id: 1, car: 'VW Golf VII', plate: 'KR 56789', client: 'Anna Nowak', issue: 'Przegląd 120k km', status: 'new' },
    { id: 2, car: 'Tesla Model 3', plate: 'WA 12345', client: 'Jan Kowalski', issue: 'Diagnostyka baterii', status: 'progress' },
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
    setTimeout(() => this.showBubble.set(false), 4000);
  }
}
