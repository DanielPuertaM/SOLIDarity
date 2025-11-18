import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NotificacionesService } from '@app/user/service/notificaciones-service';
import { AuthService } from '@auth/services/auth';
import { of } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  imports: [CommonModule, RouterLinkActive, RouterLink, FormsModule],
  templateUrl: './nav-bar.html',
})
export class NavBar {
   private router = inject(Router);
  protected readonly authService = inject(AuthService);
  private notifService = inject(NotificacionesService);

  isDrawerOpen = false;

  closeDrawer() {
    this.isDrawerOpen = false;
  }

  // Rol-dependent navigation items…
  navItems = [
    { label: 'Inicio', route: 'home' },
    { label: 'Nosotros', route: 'about' },
    { label: 'Crear campaña', route: 'campania' },
  ];

  navItemsAdmind = [
    { label: 'campañas', route: 'home' },
    { label: 'usuarios', route: 'users' },
  ];

  navItemsVerifier = [
    { label: 'campañas', route: 'home' },
    { label: 'Pdf pendientes', route: 'users/pdfs' },
  ];

  private userId = computed(() => this.authService.getUserId() ?? null);

  protected notificacionesResource = rxResource({
    params: () => ({ payload: this.userId() }),
    stream: ({ params }) =>
      params.payload
        ? this.notifService.getNotificaciones(params.payload)
        : of(null),
  });

  refreshNotifications() {
    this.notificacionesResource.reload();
  }

  navigate(route: string) {
    this.router.navigate([route]);
  }
  logout() {}
}
