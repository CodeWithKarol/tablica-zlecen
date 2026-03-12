import { Component, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
<div class="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-6 relative overflow-hidden">
  <!-- Bg Effects -->
  <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px] animate-pulse"></div>
  <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-[100px] animate-pulse" style="animation-delay: -2s"></div>

  <div class="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
    <div class="flex flex-col items-center mb-12">
      <div class="w-16 h-16 bg-neon-orange rounded-2xl flex items-center justify-center font-black text-white text-2xl shadow-[0_0_30px_rgba(255,92,26,0.3)] mb-6">TZ</div>
      <h1 class="text-3xl font-black uppercase tracking-tighter text-high-contrast">Panel_Dostępu</h1>
      <p class="text-[10px] font-mono text-white/30 uppercase tracking-[0.3em] mt-2 italic">// AUTORYZACJA_WARSZTATU_V1.0</p>
    </div>

    <div class="glass-container p-8 md:p-10 rounded-[2.5rem] border-white/10 bg-white/[0.02] backdrop-blur-xl">
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div class="space-y-2">
          <label class="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">IDENTYFIKATOR_SYSTEMOWY (E-MAIL)</label>
          <input type="email" formControlName="email" 
                 placeholder="warsztat@przyklad.pl"
                 class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-bold focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none text-white placeholder:text-white/5">
        </div>

        <div class="space-y-2">
          <label class="text-[9px] font-black uppercase text-white/30 tracking-widest ml-1">KLUCZ_DOSTĘPU</label>
          <input type="password" formControlName="password" 
                 placeholder="••••••••"
                 class="w-full bg-white/5 border border-white/10 rounded-2xl p-4 font-bold focus:ring-1 focus:ring-orange-500 focus:bg-white/10 transition-all outline-none text-white placeholder:text-white/5">
        </div>

        @if (error()) {
          <div class="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase p-4 rounded-xl animate-in slide-in-from-top-2">
            Błąd: {{ error() }}
          </div>
        }

        <button type="submit" [disabled]="loginForm.invalid || isLoading()"
                class="w-full bg-neon-orange text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_15px_30px_rgba(255,92,26,0.2)] disabled:opacity-50">
          {{ isLoading() ? 'Weryfikacja...' : 'Zaloguj_Do_Systemu' }}
        </button>
      </form>
    </div>

    <div class="mt-8 text-center">
      <a routerLink="/" class="text-[10px] font-black uppercase text-white/20 hover:text-orange-500 transition-colors tracking-widest">
        ← Powrót do strony głównej
      </a>
    </div>
  </div>
</div>
`,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  public isLoading = signal(false);
  public error = signal<string | null>(null);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  async onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading.set(true);
      this.error.set(null);
      
      try {
        const { email, password } = this.loginForm.value;
        await this.authService.signIn(email!, password!);
        await this.router.navigate(['/app/dashboard']);
      } catch (e: any) {
        this.error.set(e.message || 'Nieudana próba logowania');
      } finally {
        this.isLoading.set(false);
      }
    }
  }
}
