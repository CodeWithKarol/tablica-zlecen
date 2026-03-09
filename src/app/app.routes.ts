import { Routes } from '@angular/router';
import { LandingPage } from './landing-page/landing-page';
import { LayoutPage } from './layout-page/layout-page';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
  },
  {
    path: 'app',
    component: LayoutPage,
    children: [
      {
        path: '',
        redirectTo: 'board',
        pathMatch: 'full',
      },
      {
        path: 'board',
        loadComponent: () => import('./board/board.component').then(m => m.BoardComponent),
      },
      {
        path: 'settings',
        loadComponent: () => import('./settings/webhook-config.component').then(m => m.WebhookConfigComponent),
      }
    ]
  }
];
