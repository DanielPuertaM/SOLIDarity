import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService, Role } from "@auth/services/auth";

export const roleWildcardGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const role = auth.getRole();

  if (role === Role.ADMIN) {
    router.navigate(['/user/dashboard-admin/home']);
    return false;
  }else if (role === Role.VERIFIER) {
    router.navigate(['/user/dashboard-verificador/home']);
    return false;
  }

  router.navigate(['/user/dashboard-donante/home']);
  return false;
};
