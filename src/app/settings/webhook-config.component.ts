import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-webhook-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto py-4">
      <div class="flex items-end justify-between mb-12 border-b-2 border-black pb-8">
        <div>
          <h2 class="text-5xl font-black uppercase tracking-tighter">Automatyzacja_W_Systemie</h2>
          <div class="flex items-center gap-4 mt-2 font-mono text-[10px] uppercase">
            <span class="text-orange-600 font-bold">[POŁĄCZENIE: WEBHOOK_POST]</span>
            <span class="text-zinc-400">// INTEGRACJA_ZE_STACJĄ_ZEWNĘTRZNĄ</span>
          </div>
        </div>
      </div>

      <div class="grid gap-12">
        <!-- Webhook Settings Card -->
        <div class="bg-white border border-black">
          <div class="p-8 border-b border-black bg-zinc-100 flex items-center justify-between">
            <h3 class="font-black text-xs uppercase tracking-widest flex items-center gap-3">
              <div class="w-10 h-10 bg-black text-white flex items-center justify-center font-black text-xs border border-black">🔗</div>
              Główny Endpoint Wyjściowy
            </h3>
            <span class="font-mono text-[10px] font-bold text-orange-600">[ID: SYSTEM_AUTO_01]</span>
          </div>
          <div class="p-8 space-y-8">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-3">Webhook URL (n8n / Make.com / Zapier)</label>
              <input 
                type="text" 
                [(ngModel)]="webhookUrl"
                placeholder="https://twoj-n8n.com/webhooks/..."
                class="w-full px-5 py-4 border border-black focus:outline-none focus:ring-1 focus:ring-orange-600 transition-none font-mono text-sm bg-zinc-50/30"
              >
            </div>

            <div class="flex items-start gap-4 p-6 bg-zinc-50 border border-black font-mono">
               <div class="w-6 h-6 flex-none bg-orange-600 text-black flex items-center justify-center text-[10px] font-black">!</div>
               <p class="text-[11px] text-black leading-relaxed font-bold uppercase">
                  INFORMACJA: WEBHOOK ZOSTANIE WYZWOLONY ZA KAŻDYM RAZEM, GDY ZLECENIE ZOSTANIE PRZESUNIĘTE DO STATUSU <span class="text-orange-600">"GOTOWE / SMS"</span>. UMOŻLIWIA TO WYSYŁANIE POWIADOMIEŃ LUB AKTUALIZACJĘ ARKUSZY.
               </p>
            </div>
            
            <button 
              (click)="saveSettings()"
              class="w-full sm:w-auto px-10 py-5 bg-black text-white font-black uppercase text-sm hover:bg-orange-600 hover:text-black transition-none active:scale-100">
              Zapisz Konfigurację_Systemu
            </button>
          </div>
        </div>

        <!-- Payload Preview -->
        <div class="bg-black border border-black p-10 text-white relative overflow-hidden shadow-2xl">
           <div class="relative z-10">
              <div class="flex items-center justify-between mb-8 border-b border-white/20 pb-4">
                <h3 class="text-sm font-black uppercase tracking-widest">Struktura danych (JSON)</h3>
                <span class="px-3 py-1 border border-orange-600 text-[10px] font-black uppercase tracking-widest text-orange-600">Payload POST</span>
              </div>
              <p class="text-white/40 text-[10px] font-mono uppercase mb-6 tracking-widest">Poniższy obiekt zostanie wysłany w body zapytania:</p>
              
              <pre class="bg-zinc-900/50 p-8 border border-white/5 text-[11px] font-mono text-orange-500 leading-relaxed overflow-x-auto">
{{ payloadPreview }}
              </pre>

              <div class="mt-8 font-mono text-[9px] text-zinc-500 uppercase flex items-center gap-2">
                 <span class="w-2 h-2 bg-orange-600 animate-pulse"></span>
                 Oczekiwanie na zdarzenie systemowe...
              </div>
           </div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebhookConfigComponent {
  webhookUrl = signal('');
  
  payloadPreview = `{
  "event": "order.completed",
  "order": {
    "id": "tz_8c21a",
    "customer": "Jan Kowalski",
    "car": "Audi A4 B8",
    "plate": "WA 12345",
    "status": "done"
  },
  "timestamp": "2026-03-09T11:20:45Z"
}`;

  saveSettings() {
    console.log('Zapisywanie URL:', this.webhookUrl());
    alert('Konfiguracja zapisana! System jest gotowy do wysyłania danych.');
  }
}
