import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseClient, User } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private platformId = inject(PLATFORM_ID);
  private router = inject(Router);
  private supabaseService = inject(SupabaseService);
  
  private userSignal = signal<User | null>(null);
  readonly user = computed(() => this.userSignal());
  readonly isAuthenticated = computed(() => !!this.userSignal());

  constructor() {
    this.supabase = this.supabaseService.client;
    
    if (isPlatformBrowser(this.platformId)) {
      this.initAuth();
    }
  }

  private async initAuth() {
    // Check initial session
    const { data: { session } } = await this.supabase.auth.getSession();
    this.userSignal.set(session?.user ?? null);

    // Listen for auth changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.userSignal.set(session?.user ?? null);
      if (event === 'SIGNED_OUT') {
        this.router.navigate(['/']);
      }
    });
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  }

  async signOut() {
    await this.supabase.auth.signOut();
  }
}
