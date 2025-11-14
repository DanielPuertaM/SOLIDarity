import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService, Role } from '@auth/services/auth';

export const roleRedirectGuard: CanActivateFn = () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    const role = auth.getRole();


    if (role === Role.ADMIN) {
        return router.parseUrl('/user/dashboard-admin/home');
    }
    return router.parseUrl('/user/dashboard-donante/home');

};