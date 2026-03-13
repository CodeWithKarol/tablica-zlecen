import { Component, EventEmitter, Output, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrdersService, OrderStatus } from '../services/orders.service';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
<div class="h-full flex flex-col text-white max-w-6xl mx-auto px-4 md:px-0">
  <!-- Header -->
  <div class="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 border-b border-white/10 pb-8 gap-6">
    <div>
      <h2 class="text-4xl md:text-5xl font-black uppercase tracking-tighter text-high-contrast">Nowe_Zlecenie</h2>
      <div class="flex items-center gap-4 mt-2 font-mono text-[10px] uppercase">
        <span class="text-orange-500 font-bold">[TRYB: REJESTRACJA_ZASOBU]</span>
        <span class="text-white/40 hidden sm:inline">// PROTOKÓŁ_PRZYJĘCIA_V1.0</span>
      </div>
    </div>

    <div class="flex gap-4">
      <button (click)="goBack()" 
              class="bg-white/5 border border-white/10 px-6 py-3 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all text-white/70">
        [ESC] Powrót
      </button>
      <button (click)="onSubmit()" [disabled]="orderForm.invalid || isSubmitting()"
              class="bg-neon-orange text-white px-8 py-3 font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all shadow-[0_5px_15px_rgba(255,92,26,0.3)] disabled:opacity-50">
        {{ isSubmitting() ? 'ZAPISYWANIE...' : 'Zatwierdź_Zlecenie' }}
      </button>
    </div>
  </div>

  <div class="flex-1 overflow-y-auto custom-scrollbar pb-12">
    <form [formGroup]="orderForm" class="grid grid-cols-1 lg:grid-cols-12 gap-12 pr-10 md:pr-14">
      
      <!-- Left Column: Primary Data -->
      <div class="lg:col-span-8 space-y-12">
        
        <!-- Section: Klient & Pojazd -->
        <div class="glass-container rounded-3xl overflow-hidden border-white/10">
          <div class="bg-white/5 p-6 border-b border-white/10 flex items-center gap-3">
             <div class="w-8 h-8 bg-white/10 text-orange-500 rounded-lg flex items-center justify-center font-black text-xs border border-white/10">01</div>
             <h3 class="font-black text-xs uppercase tracking-widest text-high-contrast">Dane Podstawowe / Obiekt</h3>
          </div>
          <div class="p-8 grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
            <div class="space-y-2">
              <label class="text-[9px] font-black uppercase text-white/30 tracking-widest">KLI_NAZWA</label>
              <input type="text" formControlName="customerName" 
                     class="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold uppercase focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none text-white placeholder:text-white/5">
            </div>

            <div class="space-y-2">
              <label class="text-[9px] font-black uppercase text-white/30 tracking-widest">KLI_TELEFON</label>
              <input type="text" formControlName="customerPhone" 
                     class="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none text-white placeholder:text-white/5">
            </div>

            <div class="space-y-2">
              <label class="text-[9px] font-black uppercase text-white/30 tracking-widest">OBIEKT_MODEL</label>
              <input type="text" formControlName="carModel" 
                     class="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold uppercase focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none text-white placeholder:text-white/5">
            </div>

            <div class="space-y-2">
              <label class="text-[9px] font-black uppercase text-white/30 tracking-widest">OBIEKT_REJESTRACJA</label>
              <input type="text" formControlName="licensePlate" 
                     class="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold uppercase focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none text-white placeholder:text-white/5">
            </div>
          </div>
        </div>

        <!-- Section: Opis -->
        <div class="glass-container rounded-3xl overflow-hidden border-white/10">
          <div class="bg-white/5 p-6 border-b border-white/10 flex items-center gap-3">
             <div class="w-8 h-8 bg-white/10 text-orange-500 rounded-lg flex items-center justify-center font-black text-xs border border-white/10">02</div>
             <h3 class="font-black text-xs uppercase tracking-widest text-high-contrast">Analiza Usterki / Uwagi</h3>
          </div>
          <div class="p-8">
            <textarea formControlName="issueDescription" rows="6" 
                      class="w-full bg-white/5 border border-white/10 rounded-2xl p-6 font-medium focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none text-white placeholder:text-white/5 resize-none"
                      placeholder="Wprowadź szczegółowy opis problemu..."></textarea>
          </div>
        </div>

        <!-- Section: Zdjęcia -->
        <div class="glass-container rounded-3xl overflow-hidden border-white/10">
          <div class="bg-white/5 p-6 border-b border-white/10 flex items-center gap-3">
             <div class="w-8 h-8 bg-white/10 text-orange-500 rounded-lg flex items-center justify-center font-black text-xs border border-white/10">03</div>
             <h3 class="font-black text-xs uppercase tracking-widest text-high-contrast">Dokumentacja_Wizualna [Max: 3]</h3>
          </div>
          <div class="p-8">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
              @for (photo of photos(); track photo.id) {
                <div class="relative aspect-square rounded-2xl overflow-hidden border border-white/10 group">
                  <img [src]="photo.previewUrl" class="w-full h-full object-cover">
                  <button (click)="removePhoto(photo.id)" 
                          class="absolute top-2 right-2 w-8 h-8 bg-black/60 backdrop-blur-md rounded-lg flex items-center justify-center text-white hover:bg-red-600 transition-all opacity-0 group-hover:opacity-100">
                    ✕
                  </button>
                </div>
              }

              @if (photos().length < 3) {
                <button (click)="fileInput.click()" 
                        class="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-3 hover:bg-white/5 hover:border-orange-500/50 transition-all group">
                  <div class="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-white/40 group-hover:text-orange-500 transition-colors">
                    <span class="text-2xl">+</span>
                  </div>
                  <span class="text-[9px] font-black uppercase tracking-widest text-white/20 group-hover:text-white transition-colors">Dodaj_Zdjęcie</span>
                </button>
              }
            </div>
            <input #fileInput type="file" (change)="onFileSelected($event)" accept="image/*" class="hidden">
          </div>
        </div>
      </div>

      <!-- Right Column: Meta & Finances -->
      <div class="lg:col-span-4 space-y-12 font-mono">
        
        <!-- Section: Meta / Priority -->
        <div class="glass-container rounded-3xl overflow-hidden border-white/10">
          <div class="p-8 space-y-8">
            <div class="space-y-2">
              <label class="text-[9px] font-black uppercase text-white/30 tracking-widest">PRIORYTET_SYSTEMOWY</label>
              <select formControlName="priority" 
                      class="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold uppercase appearance-none focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none text-white">
                <option value="low" class="bg-[#1a1a1a]">NISKI / STANDARD</option>
                <option value="medium" class="bg-[#1a1a1a]">ŚREDNI / PILNE</option>
                <option value="high" class="bg-[#1a1a1a]">WYSOKI / KRYTYCZNY</option>
              </select>
            </div>

            <div class="space-y-2">
              <label class="text-[9px] font-black uppercase text-white/30 tracking-widest">TERMIN_ODBIORU</label>
              <input type="date" formControlName="deadline" 
                     class="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none text-white">
            </div>
          </div>
        </div>

        <!-- Section: Rozliczenie -->
        <div class="glass-container rounded-3xl overflow-hidden border-white/10 bg-orange-600/[0.02]">
          <div class="bg-white/5 p-6 border-b border-white/10 flex items-center gap-3">
             <div class="w-8 h-8 bg-white/10 text-orange-500 rounded-lg flex items-center justify-center font-black text-xs border border-white/10">03</div>
             <h3 class="font-black text-xs uppercase tracking-widest text-high-contrast">Budżet / Finanse</h3>
          </div>
          <div class="p-8 space-y-6">
            <div class="space-y-2">
              <label class="text-[9px] font-black uppercase text-white/30 tracking-widest">ROBOCIZNA [PLN]</label>
              <input type="number" formControlName="laborPrice" 
                     class="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none text-white">
            </div>
            <div class="space-y-2">
              <label class="text-[9px] font-black uppercase text-white/30 tracking-widest">CZĘŚCI [PLN]</label>
              <input type="number" formControlName="partsPrice" 
                     class="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none text-white">
            </div>
            <div class="space-y-2">
              <label class="text-[9px] font-black uppercase text-white/30 tracking-widest">RABAT [PLN]</label>
              <input type="number" formControlName="discountPrice" 
                     class="w-full bg-white/5 border border-white/10 rounded-xl p-4 font-bold text-orange-500 focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none">
            </div>

            <div class="pt-6 border-t border-white/10 space-y-4">
              <div class="flex justify-between items-center text-[10px] font-bold text-white/40 uppercase">
                <span>Wartość:</span>
                <span class="text-white">{{ (orderForm.get('laborPrice')?.value || 0) + (orderForm.get('partsPrice')?.value || 0) }} PLN</span>
              </div>
              <div class="flex justify-between items-end">
                <span class="text-[10px] font-black uppercase text-white/30">RAZEM:</span>
                <div class="text-right">
                  <span class="text-3xl font-black text-high-contrast tabular-nums">
                    {{ calculateTotal() }}
                  </span>
                  <span class="text-orange-500 text-xs font-bold ml-1 uppercase tracking-widest">PLN</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Submit Action (Mobile sticky simplified or just here) -->
        <button (click)="onSubmit()" [disabled]="orderForm.invalid || isSubmitting()"
                class="w-full bg-neon-orange text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(255,92,26,0.2)] disabled:opacity-50">
           {{ isSubmitting() ? 'PROCESOWANIE...' : 'ZATWIERDŹ_PROTOKÓŁ' }}
        </button>
      </div>

    </form>
  </div>
</div>
`,
  styles: [`
    :host { display: block; height: 100%; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  public isSubmitting = signal(false);
  public photos = signal<{ id: string, file: File, previewUrl: string }[]>([]);
  private fb = inject(FormBuilder);
  private ordersService = inject(OrdersService);
  private router = inject(Router);

  orderForm: FormGroup = this.fb.group({
    customerName: ['', [Validators.required]],
    customerPhone: ['', [Validators.required]],
    carModel: ['', [Validators.required]],
    licensePlate: ['', [Validators.required]],
    issueDescription: ['', [Validators.required]],
    priority: ['low', [Validators.required]],
    deadline: [''],
    estimatedPrice: [null],
    laborPrice: [0],
    partsPrice: [0],
    discountPrice: [0]
  });

  calculateTotal() {
    const labor = this.orderForm.get('laborPrice')?.value || 0;
    const parts = this.orderForm.get('partsPrice')?.value || 0;
    const discount = this.orderForm.get('discountPrice')?.value || 0;
    return (labor + parts - discount);
  }

  onFileSelected(event: any) {
    const files = event.target.files as FileList;
    if (files.length > 0 && this.photos().length < 3) {
      const file = files[0];
      const id = Math.random().toString(36).substring(2, 9);
      const previewUrl = URL.createObjectURL(file);
      this.photos.update(p => [...p, { id, file, previewUrl }]);
    }
    // Reset input so same file can be selected again
    event.target.value = '';
  }

  removePhoto(id: string) {
    this.photos.update(photos => {
      const photo = photos.find(p => p.id === id);
      if (photo) URL.revokeObjectURL(photo.previewUrl);
      return photos.filter(p => p.id !== id);
    });
  }

  async onSubmit() {
    if (this.orderForm.valid && !this.isSubmitting()) {
      this.isSubmitting.set(true);
      try {
        const photoUrls: string[] = [];
        const currentPhotos = this.photos();
        
        // Upload photos one by one
        for (const photo of currentPhotos) {
          const url = await this.ordersService.uploadPhoto(photo.file);
          photoUrls.push(url);
        }

        await this.ordersService.createOrder({
          ...this.orderForm.value,
          status: 'new',
          photoUrls
        });
        this.saved.emit();
        this.goBack();
      } catch (e) {
        console.error('Error in onSubmit:', e);
      } finally {
        this.isSubmitting.set(false);
      }
    }
  }

  goBack() {
    this.router.navigate(['/app/board']);
  }
}
