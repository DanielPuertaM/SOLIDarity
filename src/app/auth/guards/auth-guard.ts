import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Role } from '../services/auth';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const role = authService.getRole();

  if (authService.isLogged()) {
    if (role === Role.ADMIN) {
      console.log("admin")
      router.navigate(['user/dashboard-admin/home']).then();
      return false;
    } else {console.log("donante")
      router.navigate(['/user/dashboard-donante/home']).then();
      return false;
    }

  }
  return true;
};
