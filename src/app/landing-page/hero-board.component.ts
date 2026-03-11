import { ChangeDetectionStrategy, Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-board',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white border-2 border-black overflow-hidden max-w-lg mx-auto relative font-mono">
      <!-- Top Bar Mockup -->
      <div class="bg-black text-white p-2 border-b-2 border-black flex justify-between items-center">
        <span class="text-[10px] font-bold uppercase tracking-widest">SYSTEM_V2.0 // LIVE_FEED</span>
        <div class="flex gap-1">
          <div class="w-2 h-2 bg-orange-600"></div>
          <div class="w-2 h-2 bg-white"></div>
        </div>
      </div>

      <!-- Board Content -->
      <div class="p-4 grid grid-cols-3 gap-4 bg-zinc-50 min-h-[420px]">
        <!-- New Column -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-[10px] font-black text-black uppercase tracking-widest">Nowe</h3>
            <span class="text-[9px] font-bold text-white bg-black px-1.5 py-0.5">{{ newOrders().length }}</span>
          </div>
          <div class="space-y-4">
             @for (order of newOrders(); track order.id) {
               <div (click)="moveToProgress(order)" 
                    class="group cursor-pointer active:scale-95 transition-transform">
                  <div class="p-3 bg-white border border-black hover:border-orange-600 transition-colors relative overflow-hidden">
                    <div class="flex items-center justify-between mb-2">
                       <span class="text-[8px] font-bold px-1.5 py-0.5 bg-zinc-100 text-black border border-black uppercase tracking-tighter font-mono">{{ order.plate }}</span>
                       <span class="text-[10px] font-mono">#0{{ order.id }}</span>
                    </div>
                    <p class="text-[11px] font-black text-black uppercase leading-none mb-1">{{ order.car }}</p>
                    <p class="text-[9px] text-zinc-500 font-medium mb-2 uppercase">{{ order.issue }}</p>
                    <div class="flex items-center justify-between pt-2 border-t border-black/10">
                       <span class="text-[7px] font-bold text-zinc-400 uppercase italic">{{ order.client }}</span>
                       <div class="w-4 h-4 bg-black text-white flex items-center justify-center text-[6px] font-black">AN</div>
                    </div>
                  </div>
               </div>
             }
          </div>
        </div>

        <!-- In Progress Column -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-[10px] font-black text-orange-600 uppercase tracking-widest">W toku</h3>
            <span class="text-[9px] font-bold text-white bg-orange-600 px-1.5 py-0.5">{{ inProgressOrders().length }}</span>
          </div>
          <div class="space-y-4">
             @for (order of inProgressOrders(); track order.id) {
               <div (click)="moveToDone(order)" 
                    class="group cursor-pointer active:scale-95 transition-transform">
                  <div class="p-3 bg-white border border-black hover:border-orange-600 relative overflow-hidden transition-colors">
                    <div class="flex items-center justify-between mb-2">
                       <span class="text-[8px] font-bold px-1.5 py-0.5 bg-orange-600 text-white border border-black uppercase tracking-tighter font-mono">{{ order.plate }}</span>
                       <span class="animate-pulse text-[10px]">⚡</span>
                    </div>
                    <p class="text-[11px] font-black text-black uppercase leading-none mb-1">{{ order.car }}</p>
                    <p class="text-[9px] text-orange-600 font-bold mb-2 uppercase tracking-tighter">{{ order.issue }}</p>
                    
                    <!-- Execution Bar -->
                    <div class="w-full h-1 bg-zinc-100 border border-black/10 overflow-hidden mb-2">
                       <div class="h-full bg-orange-600 w-[60%] animate-pulse"></div>
                    </div>

                    <div class="flex items-center justify-between pt-2 border-t border-black/10">
                       <span class="text-[7px] font-bold text-orange-600 uppercase italic">{{ order.client }}</span>
                       <div class="w-4 h-4 bg-orange-600 text-white flex items-center justify-center text-[6px] font-black">JK</div>
                    </div>
                  </div>
               </div>
             } @empty {
               <div class="h-32 border border-dashed border-zinc-300 flex flex-col items-center justify-center gap-2">
                  <p class="text-[8px] text-zinc-400 font-bold uppercase tracking-tighter">PRZENIEŚ TUTAJ</p>
               </div>
             }
          </div>
        </div>

        <!-- Done Column -->
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between mb-1">
            <h3 class="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Gotowe</h3>
            <span class="text-[9px] font-bold text-white bg-zinc-300 px-1.5 py-0.5">{{ doneOrders().length }}</span>
          </div>
          <div class="space-y-4">
             @for (order of doneOrders(); track order.id) {
               <div class="opacity-40 grayscale scale-95 origin-top">
                  <div class="p-3 bg-white border border-black relative">
                    <div class="flex items-center justify-between mb-2">
                       <span class="text-[8px] font-bold px-1.5 py-0.5 bg-zinc-100 text-zinc-500 border border-black uppercase tracking-tighter font-mono">{{ order.plate }}</span>
                       <span class="text-green-600 text-[10px]">✓</span>
                    </div>
                    <p class="text-[11px] font-black text-black uppercase line-through decoration-orange-600 decoration-2">{{ order.car }}</p>
                    <div class="mt-3 flex flex-col gap-1">
                       <p class="text-[8px] text-orange-600 font-black uppercase tracking-tighter flex items-center gap-1">
                          <span class="w-1.5 h-1.5 bg-orange-600"></span> SMS WYSŁANY
                       </p>
                       <span class="text-[7px] font-mono text-zinc-400 uppercase tracking-tighter">MAKE.COM_HOOK_OK</span>
                    </div>
                  </div>
               </div>
             }
          </div>
        </div>
      </div>

      <!-- Feedback Bubble -->
      @if (showBubble()) {
        <div class="absolute inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-[1px] animate-in fade-in duration-200">
           <div class="bg-black text-white px-6 py-6 border-2 border-white shadow-[0_0_0_2px_rgba(0,0,0,1)] flex flex-col items-center text-center gap-2 transform animate-in zoom-in-95 duration-200">
              <div class="w-10 h-10 bg-orange-600 flex items-center justify-center text-xl mb-2">⚡</div>
              <h4 class="text-[10px] font-black uppercase tracking-widest text-orange-600">WEBHOOK_TRIGGERED</h4>
              <p class="text-[8px] font-bold uppercase text-zinc-400 max-w-[150px]">Data transmitted to automation system</p>
              <div class="mt-4 w-full h-1 bg-zinc-800 overflow-hidden">
                 <div class="h-full bg-orange-600 animate-[loading_4s_linear]"></div>
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
