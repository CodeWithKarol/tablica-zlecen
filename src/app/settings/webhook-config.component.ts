import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-webhook-config',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-4xl mx-auto py-4">
      <div class="mb-10">
        <h2 class="text-4xl font-bold text-slate-900 tracking-tight">Automatyzacja Webhook</h2>
        <p class="text-slate-500 mt-2 font-medium">Połącz Tablicę Zleceń z n8n, Make lub Zapier, aby wyzwalać akcje zewnętrzne.</p>
      </div>

      <div class="grid gap-10">
        <!-- Webhook Settings Card -->
        <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div class="p-8 border-b border-slate-100 bg-slate-50/50">
            <h3 class="font-bold text-slate-900 flex items-center gap-3">
              <div class="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600">🔗</div>
              Główny Endpoint
            </h3>
          </div>
          <div class="p-8 space-y-8">
            <div>
              <label class="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">Webhook URL (n8n / Make.com / Zapier)</label>
              <input 
                type="text" 
                [(ngModel)]="webhookUrl"
                placeholder="https://twoj-n8n.com/webhooks/..."
                class="w-full px-5 py-4 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary-500/10 focus:border-primary-500 transition-all font-mono text-sm bg-slate-50/30"
              >
            </div>

            <div class="flex items-start gap-4 p-6 bg-primary-50 rounded-2xl border border-primary-100">
               <div class="w-8 h-8 flex-none bg-primary-600 rounded-full flex items-center justify-center text-white text-xs font-bold">i</div>
               <p class="text-sm text-primary-900 leading-relaxed font-medium">
                  Informacja: Webhook zostanie wyzwolony za każdym razem, gdy zlecenie zostanie przesunięte do statusu <strong>"Gotowe / SMS"</strong>. Umożliwia to wysyłanie powiadomień lub aktualizację arkuszy.
               </p>
            </div>
            
            <button 
              (click)="saveSettings()"
              class="w-full sm:w-auto px-10 py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-all shadow-lg shadow-primary-500/20 active:scale-95">
              Zapisz Konfigurację
            </button>
          </div>
        </div>

        <!-- Payload Preview -->
        <div class="bg-slate-900 rounded-[2rem] p-10 text-white relative overflow-hidden shadow-2xl">
           <div class="relative z-10">
              <div class="flex items-center justify-between mb-6">
                <h3 class="text-xl font-bold">Struktura danych (JSON)</h3>
                <span class="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/60">Payload POST</span>
              </div>
              <p class="text-white/40 text-sm mb-6 font-medium">Poniższy obiekt zostanie wysłany w body zapytania:</p>
              
              <pre class="bg-black/40 p-8 rounded-2xl border border-white/5 text-xs font-mono text-primary-300 leading-relaxed overflow-x-auto shadow-inner">
{{ payloadPreview }}
              </pre>
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
