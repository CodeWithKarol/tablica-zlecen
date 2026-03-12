import { ChangeDetectionStrategy, Component, inject, input, output, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order, OrdersService } from '../services/orders.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-print',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (currentOrder(); as order) {
      <div class="fixed inset-0 bg-[#050505] z-[100] flex flex-col p-4 md:p-12 overflow-y-auto print:p-0 font-mono text-white print:text-black print:bg-white">
        <!-- On-screen Glass Container -->
        <div class="glass-container print-isolated max-w-4xl mx-auto w-full p-8 md:p-16 rounded-3xl border-white/10 shadow-2xl print:border-none print:shadow-none print:bg-white print:p-0 print:max-w-none">
          
          <!-- Header -->
          <div class="flex justify-between items-start border-b-4 border-white/20 print:border-black pb-8 mb-12">
            <div>
              <h1 class="text-3xl md:text-5xl font-black uppercase tracking-tighter mb-2 text-high-contrast print:text-black">POTWIERDZENIE_ZLECENIA</h1>
              <p class="text-[10px] md:text-xs font-black opacity-40 uppercase tracking-[0.3em] print:text-black print:opacity-70 italic">// SYSTEM_TABLICY // SWISS_STANDARDS</p>
            </div>
            <div class="text-right">
              <p class="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/30 print:text-black/50 mb-1">Data_Wystawienia</p>
              <p class="text-sm md:text-base font-black text-orange-500 print:text-black">{{ order.createdAt | date:'yyyy-MM-dd HH:mm' }}</p>
            </div>
          </div>

          <!-- Main Info -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div class="border-l-4 border-orange-600 print:border-black pl-8">
              <h2 class="text-[10px] font-black uppercase text-white/30 print:text-black/50 mb-4 tracking-widest">Dane_Pojazdu</h2>
              <p class="text-2xl md:text-3xl font-black uppercase mb-2 text-high-contrast print:text-black">{{ order.carModel }}</p>
              <div class="flex items-center gap-4">
                <span class="text-xs font-black bg-orange-600/10 border border-orange-500/30 text-orange-500 px-3 py-1 print:bg-zinc-100 print:border-black print:text-black">{{ order.licensePlate }}</span>
                <span class="text-[10px] font-black text-white/20 print:text-black/40 uppercase tracking-tighter">OBIEKT_ID: {{ order.id.substring(0, 8) }}</span>
              </div>
            </div>
            <div class="border-l-4 border-white/20 print:border-black pl-8">
              <h2 class="text-[10px] font-black uppercase text-white/30 print:text-black/50 mb-4 tracking-widest">Dane_Klienta</h2>
              <p class="text-xl md:text-2xl font-black uppercase mb-1 text-high-contrast print:text-black">{{ order.customerName }}</p>
              <p class="text-base md:text-lg font-black tracking-widest text-orange-600/80 print:text-black">{{ order.customerPhone }}</p>
            </div>
          </div>

          <!-- Description -->
          <div class="mb-12">
            <h2 class="text-[10px] font-black uppercase text-white/30 print:text-black/50 mb-6 border-b border-white/10 print:border-black/10 pb-2 tracking-widest italic">// OPIS_ANALIZA_TECHNICZNA</h2>
            <div class="p-8 md:p-10 bg-white/5 border border-white/10 rounded-2xl print:bg-zinc-50 print:border-black/10 print:rounded-none">
              <p class="text-lg md:text-xl leading-relaxed whitespace-pre-wrap uppercase font-black tracking-tight text-white/90 print:text-black">
                {{ order.issueDescription }}
              </p>
            </div>
          </div>

          <!-- Photos Documentation -->
          @if (order.photoUrls && order.photoUrls.length > 0) {
            <div class="mb-16">
              <h2 class="text-[10px] font-black uppercase text-white/30 print:text-black/50 mb-6 border-b border-white/10 print:border-black/10 pb-2 tracking-widest italic">// DOKUMENTACJA_WIZUALNA_OBIEKTU</h2>
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                @for (photoUrl of order.photoUrls.slice(0, 3); track photoUrl) {
                  <div class="aspect-square rounded-2xl overflow-hidden border border-white/10 print:border-black/10">
                    <img [src]="photoUrl" class="w-full h-full object-cover">
                  </div>
                }
              </div>
            </div>
          }

          <!-- Pricing Breakdown -->
          <div class="mb-16 border-t-2 border-white/10 print:border-black pt-12">
            <h2 class="text-[10px] font-black uppercase text-white/20 print:text-black/40 mb-10 tracking-widest text-center">// ROZLICZENIE_FINANSOWE</h2>
            
            <div class="space-y-6 max-w-lg mx-auto">
              <div class="flex justify-between items-center text-sm md:text-base font-black uppercase text-white/60 print:text-black">
                <span class="tracking-tight">Usługi / Robocizna:</span>
                <span class="text-white print:text-black">{{ order.laborPrice || 0 }} <span class="text-[10px]">PLN</span></span>
              </div>
              <div class="flex justify-between items-center text-sm md:text-base font-black uppercase text-white/60 print:text-black">
                <span class="tracking-tight">Części i Materiały:</span>
                <span class="text-white print:text-black">{{ order.partsPrice || 0 }} <span class="text-[10px]">PLN</span></span>
              </div>
              @if (order.discountPrice) {
                <div class="flex justify-between items-center text-sm md:text-base font-black uppercase text-orange-500 print:text-black">
                  <span class="tracking-tight">Rabat udzielony:</span>
                  <span>- {{ order.discountPrice }} <span class="text-[10px]">PLN</span></span>
                </div>
              }
              <div class="pt-8 border-t-2 border-dashed border-white/20 print:border-black flex justify-between items-end">
                <span class="text-xs font-black uppercase text-white/40 print:text-black/50">Suma_Do_Zapłaty:</span>
                <span class="text-4xl md:text-6xl font-black text-orange-600 print:text-black">
                  {{ (order.laborPrice || 0) + (order.partsPrice || 0) - (order.discountPrice || 0) }} 
                  <span class="text-sm md:text-base">PLN</span>
                </span>
              </div>
            </div>
          </div>

          <!-- Footer / Signature -->
          <div class="mt-24 pt-12 border-t border-white/5 print:border-black/10 flex flex-col md:flex-row justify-between items-center md:items-end gap-12">
            <div class="w-full md:w-72">
              <div class="border-b-2 border-white/20 print:border-black mb-4 h-20 relative">
                 <span class="absolute -bottom-1 -left-1 w-2 h-2 bg-orange-600 print:bg-black"></span>
                 <span class="absolute -bottom-1 -right-1 w-2 h-2 bg-orange-600 print:bg-black"></span>
              </div>
              <p class="text-[9px] font-black uppercase text-center tracking-[0.4em] text-white/40 print:text-black/60">AUTORYZACJA_WYKONAWCY</p>
            </div>
            <div class="text-[9px] font-black text-white/20 print:text-black/40 max-w-sm text-center md:text-right leading-relaxed uppercase tracking-tighter">
              DOKUMENT_VYGENEROWANY_AUTOMATYCZNIE_PRZEZ_SYSTEM_TABLICY.<br>
              STANDARD_SWISS_WORKSHOP // MODUŁ_ROZLICZEŃ_MVP_0.2
            </div>
          </div>
        </div>

        <!-- Floating Controls (Hidden in Print) -->
        <div class="fixed bottom-8 left-1/2 -translate-x-1/2 flex gap-4 print:hidden px-4 w-full max-w-md">
          <button (click)="onClose()" 
                  class="flex-1 bg-white/5 backdrop-blur-md text-white px-6 py-4 font-black uppercase text-[11px] hover:bg-white/10 transition-all border border-white/10 rounded-xl">
            Zamknij
          </button>
          <button (click)="print()" 
                  class="flex-[2] bg-orange-600 shadow-[0_10px_30px_rgba(255,92,26,0.3)] text-white px-6 py-4 font-black uppercase text-[11px] hover:scale-105 transition-all rounded-xl">
            Drukuj_Dokument
          </button>
        </div>
      </div>
    } @else {
      <div class="fixed inset-0 bg-[#050505] z-[110] flex items-center justify-center font-mono text-orange-500 uppercase">
        <p class="animate-pulse">Wczytywanie_Dokumentu...</p>
      </div>
    }
  `,
  styles: [`
    @media print {
      /* Reset fixed layout for print engines */
      .fixed { 
        position: static !important; 
        inset: auto !important; 
        overflow: visible !important; 
        padding: 0 !important; 
        height: auto !important;
        background: white !important;
        color: black !important;
      }
      
      /* Force white background and black text on everything */
      * {
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        color-scheme: light !important;
      }

      /* Disable all glass/blur effects that break PDF generation */
      .glass-container {
        background: white !important;
        backdrop-filter: none !important;
        -webkit-backdrop-filter: none !important;
        border: 2px solid black !important;
        box-shadow: none !important;
        color: black !important;
        padding: 0 !important;
      }

      /* Hide interactive elements and sidebar/layout leftovers */
      .print\\:hidden { display: none !important; }
      
      /* Ensure text is black for high-contrast */
      .text-high-contrast, .text-white, .text-orange-500, .text-orange-600 {
        color: black !important;
      }

      .bg-white\\/5, .bg-orange-600\\/10, .bg-zinc-50 {
        background-color: #f8f8f8 !important;
        border-color: #000 !important;
      }

      .border-white\\/10, .border-white\\/20 {
        border-color: #eee !important;
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPrintComponent {
  private route = inject(ActivatedRoute);
  private orderService = inject(OrdersService);
  
  order = input<Order | null>(null);
  close = output<void>();

  currentOrder = computed(() => {
    // If order is passed via input (modal mode)
    const inputOrder = this.order();
    if (inputOrder) return inputOrder;

    // Otherwise, fetch from service based on route ID
    const id = this.route.snapshot.params['id'];
    if (id) {
      return this.orderService.orders().find(o => o.id === id) || null;
    }
    return null;
  });

  constructor() {}

  onClose() {
    if (this.order()) {
      this.close.emit();
    } else {
      window.history.back();
    }
  }

  print() {
    window.print();
  }
}
