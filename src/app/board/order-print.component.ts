import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Order } from '../services/orders.service';

@Component({
  selector: 'app-order-print',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 bg-white z-[100] p-12 overflow-y-auto print:p-0 font-mono text-black">
      <!-- Header -->
      <div class="flex justify-between items-start border-b-4 border-black pb-8 mb-8">
        <div>
          <h1 class="text-4xl font-black uppercase tracking-tighter mb-2">POTWIERDZENIE_ZLECENIA</h1>
          <p class="text-sm font-bold opacity-70">SYSTEM_TABLICY // MVP_0.1</p>
        </div>
        <div class="text-right">
          <p class="text-xs font-black uppercase tracking-widest text-zinc-400">Data_Wystawienia</p>
          <p class="text-sm font-bold">{{ order().createdAt | date:'yyyy-MM-dd HH:mm' }}</p>
        </div>
      </div>

      <!-- Main Info -->
      <div class="grid grid-cols-2 gap-12 mb-12">
        <div class="border-l-4 border-black pl-6">
          <h2 class="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-widest">Dane_Pojazdu</h2>
          <p class="text-2xl font-black uppercase mb-1">{{ order().carModel }}</p>
          <p class="text-xs font-bold text-zinc-500 uppercase tracking-tighter">OBIEKT_ID: {{ order().id.substring(0, 8) }}</p>
        </div>
        <div class="border-l-4 border-black pl-6">
          <h2 class="text-[10px] font-black uppercase text-zinc-400 mb-2 tracking-widest">Dane_Klienta</h2>
          <p class="text-xl font-black uppercase mb-1">{{ order().customerName }}</p>
          <p class="text-sm font-bold font-mono tracking-widest text-orange-600">{{ order().customerPhone }}</p>
        </div>
      </div>

      <!-- Description -->
      <div class="mb-12">
        <h2 class="text-[10px] font-black uppercase text-zinc-400 mb-4 border-b border-zinc-200 pb-2 tracking-widest">Opis_Usterki_Analiza</h2>
        <div class="p-6 bg-zinc-50 border border-black/10">
          <p class="text-lg leading-relaxed whitespace-pre-wrap uppercase font-bold tracking-tight">
            {{ order().issueDescription }}
          </p>
        </div>
      </div>

      <!-- Meta Info -->
      <div class="grid grid-cols-3 gap-8 p-8 border border-black mb-12">
        <div>
          <span class="block text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Priorytet</span>
          <span class="text-xs font-black uppercase px-2 py-0.5 border border-black" 
                [class.bg-orange-600]="order().priority === 'high'"
                [class.text-white]="order().priority === 'high'">
            {{ order().priority }}
          </span>
        </div>
        <div>
          <span class="block text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Termin_Realizacji</span>
          <span class="text-xs font-black uppercase">{{ order().deadline || 'NIE_OKREŚLONO' }}</span>
        </div>
        <div>
          <span class="block text-[8px] font-black uppercase text-zinc-400 tracking-widest mb-1">Szacowany_Koszt</span>
          <span class="text-xs font-black uppercase font-mono">{{ order().estimatedPrice ? (order().estimatedPrice + ' PLN') : 'DO_WYCENY' }}</span>
        </div>
      </div>

      <!-- Footer / Signature -->
      <div class="mt-32 pt-12 border-t border-zinc-200 flex justify-between items-end">
        <div class="w-64">
          <div class="border-b-2 border-black mb-2 h-16 relative">
             <span class="absolute -bottom-1 -left-1 w-2 h-2 bg-black"></span>
             <span class="absolute -bottom-1 -right-1 w-2 h-2 bg-black"></span>
          </div>
          <p class="text-[8px] font-black uppercase text-center tracking-[0.2em]">Podpis_Zleceniobiorcy</p>
        </div>
        <div class="text-[9px] font-bold text-zinc-400 max-w-xs text-right leading-tight">
          DOKUMENT_VYGENEROWANY_AUTOMATYCZNIE_PRZEZ_SYSTEM_TABLICY.<br>
          WERSJA_SYSTEMU: MVP_0.1 // WORKSHOP_SWISS_STANDARDS.
        </div>
      </div>

      <!-- Controls (Hidden in Print) -->
      <div class="fixed bottom-12 right-12 flex gap-4 print:hidden">
        <button (click)="close.emit()" 
                class="bg-zinc-200 text-black px-8 py-4 font-black uppercase text-xs hover:bg-zinc-300 transition-none border border-black">
          Zamknij
        </button>
        <button (click)="print()" 
                class="bg-black text-white px-12 py-4 font-black uppercase text-xs hover:bg-orange-600 hover:text-black transition-none">
          Drukuj_Dokument
        </button>
      </div>
    </div>
  `,
  styles: [`
    @media print {
      .fixed { position: static !important; inset: auto !important; overflow: visible !important; padding: 0 !important; }
      .bg-white { background: white !important; }
      .bg-zinc-50 { background-color: #f4f4f5 !important; -webkit-print-color-adjust: exact; }
      .print\\:hidden { display: none !important; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderPrintComponent {
  order = input.required<Order>();
  close = output<void>();

  print() {
    window.print();
  }
}
