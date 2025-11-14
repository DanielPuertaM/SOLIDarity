import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@auth/services/auth';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule,RouterLinkActive,RouterLink],
  templateUrl: './nav-bar.html'
})
export class NavBar {
   private router = inject(Router);
   protected readonly authService = inject(AuthService);

  classActiveRouter = 'font-medium text-primary'

navItems = [
    { label: 'Inicio', route: 'home' },
    { label: 'Nosotros', route: 'about' },
    { label: 'Crear campaña', route: 'campania' },
  ];

  navItemsAdmind = [
    { label: 'campañas', route: 'home' },
    { label: 'usuarios', route: 'users' },
  ];

  navigate(route: string) {
    this.router.navigate([route]);
  }

  logout() {

  }

}
