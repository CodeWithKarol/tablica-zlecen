import { ChangeDetectionStrategy, Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrdersService } from '../services/orders.service';

@Component({
  selector: 'app-webhook-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="h-full overflow-y-auto custom-scrollbar">
      <div class="max-w-4xl mx-auto py-8 px-8 md:px-12 text-white">
      <div class="flex items-end justify-between mb-12 border-b border-white/10 pb-8">
        <div>
          <h2 class="text-5xl font-black uppercase tracking-tighter text-high-contrast">Automatyzacja_W_Systemie</h2>
          <div class="flex items-center gap-4 mt-2 font-mono text-[10px] uppercase">
            <span class="text-orange-500 font-bold">[POŁĄCZENIE: WEBHOOK_POST]</span>
            <span class="text-white/40">// INTEGRACJA_ZE_STACJĄ_ZEWNĘTRZNĄ</span>
          </div>
        </div>
      </div>

      <div class="grid gap-12">
        <!-- Webhook Settings Card -->
        <div class="glass-container overflow-hidden rounded-3xl border-white/10">
          <div class="p-8 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h3 class="font-black text-xs uppercase tracking-widest flex items-center gap-3 text-high-contrast">
              <div class="w-10 h-10 bg-white/10 text-orange-500 rounded-xl flex items-center justify-center font-black text-xs border border-white/10 shadow-[0_0_15px_rgba(255,92,26,0.2)]">🔗</div>
              Główny Endpoint Wyjściowy
            </h3>
            <span class="font-mono text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded shadow-[0_0_10px_rgba(255,92,26,0.1)]">[ID: SYSTEM_AUTO_01]</span>
          </div>
          <div class="p-8 space-y-8">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Webhook URL (n8n / Make.com / Zapier)</label>
              <input 
                type="text" 
                [(ngModel)]="webhookUrl"
                placeholder="https://twoj-n8n.com/webhooks/..."
                class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all font-mono text-sm text-white placeholder:text-white/10"
              >
            </div>

            <div class="flex items-start gap-4 p-6 bg-orange-500/5 border border-orange-500/20 rounded-xl font-mono">
               <div class="w-6 h-6 flex-none bg-orange-600 text-white rounded-md flex items-center justify-center text-[10px] font-black shadow-[0_0_10px_rgba(255,92,26,0.3)]">!</div>
               <p class="text-[11px] text-medium-contrast leading-relaxed font-bold uppercase">
                  INFORMACJA: WEBHOOK ZOSTANIE WYZWOLONY ZA KAŻDYM RAZEM, GDY ZLECENIE ZOSTANIE PRZESUNIĘTE DO STATUSU <span class="neon-orange">"GOTOWE / SMS"</span>. UMOŻLIWIA TO WYSYŁANIE POWIADOMIEŃ LUB AKTUALIZACJĘ ARKUSZY.
               </p>
            </div>
            
            <button 
              (click)="saveSettings()"
              class="w-full sm:w-auto px-10 py-5 bg-neon-orange text-white font-black uppercase text-sm rounded-xl hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,92,26,0.2)]">
              Zapisz Konfigurację_Endpointu
            </button>
          </div>
        </div>

        <!-- SMS Template Settings Card -->
        <div class="glass-container overflow-hidden rounded-3xl border-white/10">
          <div class="p-8 border-b border-white/10 bg-white/5 flex items-center justify-between">
            <h3 class="font-black text-xs uppercase tracking-widest flex items-center gap-3 text-high-contrast">
              <div class="w-10 h-10 bg-white/10 text-orange-500 rounded-xl flex items-center justify-center font-black text-xs border border-white/10">📱</div>
              Szablon Powiadomienia (SMS)
            </h3>
            <span class="font-mono text-[10px] font-bold text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded">[ID: SMS_TEMPLATE_01]</span>
          </div>
          <div class="p-8 space-y-8">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-white/30 mb-3">Treść Powiadomienia</label>
              <textarea 
                [(ngModel)]="smsTemplate"
                rows="4"
                placeholder="Twoje zlecenie {{ '{' }}order_id{{ '}' }}..."
                class="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all font-mono text-sm text-white placeholder:text-white/10 resize-none"
              ></textarea>
              <div class="mt-4 flex flex-wrap gap-2">
                <span class="text-[9px] px-2 py-1 bg-white/5 border border-white/10 rounded text-white/40 font-mono">Dostępne tagi:</span>
                <span class="text-[9px] px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-orange-500 font-mono">{{ '{' }}order_id{{ '}' }}</span>
                <span class="text-[9px] px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-orange-500 font-mono">{{ '{' }}car_model{{ '}' }}</span>
                <span class="text-[9px] px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-orange-500 font-mono">{{ '{' }}customer_name{{ '}' }}</span>
                <span class="text-[9px] px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded text-orange-500 font-mono">{{ '{' }}total_price{{ '}' }}</span>
              </div>
            </div>

            <button 
              (click)="saveSettings()"
              class="w-full sm:w-auto px-10 py-5 bg-neon-orange text-white font-black uppercase text-sm rounded-xl hover:scale-105 transition-all shadow-[0_10px_30px_rgba(255,92,26,0.2)]">
              Zatwierdź Szablon_Powiadomień
            </button>
          </div>
        </div>

        <!-- Payload Preview -->
        <div class="glass-container overflow-hidden rounded-3xl border-white/10 bg-black/40 p-10 text-white relative shadow-2xl">
           <div class="relative z-10">
              <div class="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <h3 class="text-sm font-black uppercase tracking-widest text-high-contrast">Struktura danych (JSON)</h3>
                <span class="px-3 py-1 border border-orange-500 text-[10px] font-black uppercase tracking-widest text-orange-500 bg-orange-500/5 rounded shadow-[0_0_10px_rgba(255,92,26,0.1)]">Payload POST</span>
              </div>
              <p class="text-white/40 text-[10px] font-mono uppercase mb-6 tracking-widest">Poniższy obiekt zostanie wysłany w body zapytania:</p>
              
              <pre class="bg-black/50 p-8 rounded-2xl border border-white/5 text-[11px] font-mono text-orange-500/90 leading-relaxed overflow-x-auto custom-scrollbar shadow-inner">
{{ payloadPreview }}
              </pre>

              <div class="mt-8 font-mono text-[9px] text-white/30 uppercase flex items-center gap-2">
                 <span class="w-2 h-2 bg-orange-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(255,92,26,0.8)]"></span>
                 Oczekiwanie na zdarzenie systemowe...
              </div>
           </div>
           <!-- Decorative glow inside -->
           <div class="absolute -bottom-1/4 -right-1/4 w-64 h-64 bg-orange-600/5 blur-3xl pointer-events-none"></div>
        </div>
      </div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WebhookConfigComponent implements OnInit {
  private orderService = inject(OrdersService);
  
  webhookUrl = '';
  smsTemplate = '';
  
  async ngOnInit() {
    // Load existing settings
    if (typeof window !== 'undefined') {
      this.webhookUrl = localStorage.getItem('system_webhook_url') || '';
    }
    const template = await this.orderService.getSetting('sms_template');
    if (template) {
      this.smsTemplate = template;
    }
  }

  payloadPreview = `{
  "event": "order.completed",
  "message": "Twoje zlecenie tz_8c21a dla Audi A4 B8 jest gotowe. Cena: 450 PLN.",
  "order": {
    "id": "tz_8c21a",
    "customer": "Jan Kowalski",
    "car": "Audi A4 B8",
    "phone": "+48 500 600 700",
    "totalPrice": 450
  },
  "timestamp": "2026-03-09T11:20:45Z"
}`;

  async saveSettings() {
    if (typeof window !== 'undefined') {
      localStorage.setItem('system_webhook_url', this.webhookUrl);
    }
    await this.orderService.updateSetting('sms_template', this.smsTemplate);
    alert('Konfiguracja zapisana pomyślnie!');
  }
}
