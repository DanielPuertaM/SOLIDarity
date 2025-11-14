import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth/services/auth';

export const userGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isLogged()) {
    console.log('User is not logged in, redirecting to auth by userGuard');
    router.navigate(['']).then();
    return false;
  }
  console.log('User is logged in, access granted by userGuard');
  return true;
};
