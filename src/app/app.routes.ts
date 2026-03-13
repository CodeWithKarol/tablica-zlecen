import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { LayoutPage } from './layout-page/layout-page';
import { authGuard } from './auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'login',
    loadComponent: () => import('./auth/login.component').then(m => m.LoginComponent),
  },
  {
    path: 'app',
    component: LayoutPage,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'board',
        loadComponent: () => import('./board/board.component').then(m => m.BoardComponent),
      },
      {
        path: 'clients',
        loadComponent: () => import('./clients/client-list.component').then(m => m.ClientListComponent),
      },
      {
        path: 'clients/:phone',
        loadComponent: () => import('./clients/client-detail.component').then(m => m.ClientDetailComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/webhook-config.component').then(m => m.WebhookConfigComponent),
      },
      {
        path: 'orders/new',
        loadComponent: () => import('./board/order-form.component').then(m => m.OrderFormComponent),
      }
    ]
  },
  {
    path: 'app/orders/:id/print',
    loadComponent: () => import('./board/order-print.component').then(m => m.OrderPrintComponent),
  }
];
