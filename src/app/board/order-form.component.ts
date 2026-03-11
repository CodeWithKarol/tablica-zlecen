import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrdersService, OrderStatus } from '../services/orders.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div class="bg-white w-full max-w-2xl border-4 border-black relative">
        <!-- Industrial Header -->
        <div class="bg-black text-white p-6 flex justify-between items-center">
          <div>
            <h2 class="text-3xl font-black uppercase tracking-tighter leading-none">NOWE_ZLECENIE</h2>
            <p class="font-mono text-[10px] text-zinc-400 mt-1 tracking-widest uppercase">// PROTOKÓŁ_PRZYJĘCIA_V1.0</p>
          </div>
          <button (click)="close.emit()" class="w-12 h-12 border-2 border-white flex items-center justify-center hover:bg-orange-600 transition-none group">
            <span class="text-2xl font-light leading-none group-hover:text-black">×</span>
          </button>
        </div>

        <!-- Form Body -->
        <form [formGroup]="orderForm" (ngSubmit)="onSubmit()" class="p-8">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <!-- Left Column: Customer & Vehicle -->
            <div class="space-y-6">
              <div class="space-y-1">
                <label class="font-mono text-[10px] font-black uppercase text-zinc-500">KLI_NAZWA</label>
                <input type="text" formControlName="customerName" 
                       class="w-full border-2 border-black p-3 font-bold uppercase focus:ring-0 focus:border-orange-600 transition-none outline-none">
              </div>

              <div class="space-y-1">
                <label class="font-mono text-[10px] font-black uppercase text-zinc-500">KLI_TELEFON</label>
                <input type="text" formControlName="customerPhone" 
                       class="w-full border-2 border-black p-3 font-mono font-bold focus:ring-0 focus:border-orange-600 transition-none outline-none">
              </div>

              <div class="space-y-1">
                <label class="font-mono text-[10px] font-black uppercase text-zinc-500">OBIEKT_MODEL</label>
                <input type="text" formControlName="carModel" 
                       class="w-full border-2 border-black p-3 font-bold uppercase focus:ring-0 focus:border-orange-600 transition-none outline-none">
              </div>
            </div>

            <!-- Right Column: Details -->
            <div class="space-y-6">
              <div class="space-y-1">
                <label class="font-mono text-[10px] font-black uppercase text-zinc-500">PRIORYTET</label>
                <select formControlName="priority" 
                        class="w-full border-2 border-black p-3 font-bold uppercase appearance-none bg-white focus:ring-0 focus:border-orange-600 transition-none outline-none">
                  <option value="low">NISKI / STANDARD</option>
                  <option value="medium">ŚREDNI / PILNE</option>
                  <option value="high">WYSOKI / KRYTYCZNY</option>
                </select>
              </div>

              <div class="space-y-1">
                <label class="font-mono text-[10px] font-black uppercase text-zinc-500">TERMIN_ODBIORU</label>
                <input type="date" formControlName="deadline" 
                       class="w-full border-2 border-black p-3 font-mono font-bold focus:ring-0 focus:border-orange-600 transition-none outline-none">
              </div>

              <div class="space-y-1">
                <label class="font-mono text-[10px] font-black uppercase text-zinc-500">SZACOWANA_CENA</label>
                <div class="relative">
                  <input type="number" formControlName="estimatedPrice" 
                         class="w-full border-2 border-black p-3 font-mono font-bold focus:ring-0 focus:border-orange-600 transition-none outline-none">
                  <span class="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs font-black">PLN</span>
                </div>
              </div>
            </div>

            <!-- Full Width: Description -->
            <div class="md:col-span-2 space-y-1">
              <label class="font-mono text-[10px] font-black uppercase text-zinc-500">OPIS_USTERKI / UWAGI</label>
              <textarea formControlName="issueDescription" rows="4" 
                        class="w-full border-2 border-black p-3 font-medium focus:ring-0 focus:border-orange-600 transition-none outline-none resize-none"></textarea>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="mt-8 flex gap-4">
            <button type="button" (click)="close.emit()" 
                    class="flex-1 border-2 border-black p-4 font-black uppercase text-sm hover:bg-zinc-100 transition-none">
              Anuluj
            </button>
            <button type="submit" [disabled]="orderForm.invalid"
                    class="flex-[2] bg-black text-white p-4 font-black uppercase text-sm hover:bg-orange-600 hover:text-black transition-none disabled:opacity-50 disabled:hover:bg-black disabled:hover:text-white">
              Zatwierdź_Zlecenie
            </button>
          </div>
        </form>

        <!-- Decorative Elements -->
        <div class="absolute -bottom-1 -right-1 w-12 h-12 border-r-4 border-b-4 border-orange-600 pointer-events-none"></div>
        <div class="absolute -top-1 -left-1 w-12 h-12 border-l-4 border-t-4 border-orange-600 pointer-events-none"></div>
      </div>
    </div>
  `,
  styles: []
})
export class OrderFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private ordersService = inject(OrdersService);

  orderForm: FormGroup = this.fb.group({
    customerName: ['', [Validators.required]],
    customerPhone: ['', [Validators.required]],
    carModel: ['', [Validators.required]],
    issueDescription: ['', [Validators.required]],
    priority: ['low', [Validators.required]],
    deadline: [''],
    estimatedPrice: [null]
  });

  async onSubmit() {
    if (this.orderForm.valid) {
      await this.ordersService.createOrder({
        ...this.orderForm.value,
        status: 'new'
      });
      this.saved.emit();
      this.close.emit();
    }
  }
}
