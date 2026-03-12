import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Note: For absolute robustness, we might want to wait for initAuth if it hasn't completed
  // but for MVP, checking the current signal state or session is usually enough.
  // A better way would be to check the session directly if signal hasn't been set yet.
  
  if (authService.isAuthenticated()) {
    return true;
  }

  return router.parseUrl('/login');
};
