import { Routes } from '@angular/router';
import { authGuard } from '@auth/guards/auth-guard';
import { userGuard } from '@auth/guards/user-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('@shared/components/landing-page/landing-page'),
  },
   {
    path: 'steps',
    loadComponent: () => import('@shared/components/steps/steps'),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes'),
    canActivateChild: [authGuard],
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.routes'),
    canActivateChild: [userGuard],
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];
