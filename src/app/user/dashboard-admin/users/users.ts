import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { UserService } from '@app/user/service/user-service';
import { AuthService } from '@auth/services/auth';
import { GlobalService } from '@core/services/global_service';
import { UserCard } from '@shared/components/user-card/user-card';

@Component({
  selector: 'app-users',
  imports: [UserCard,CommonModule],
  templateUrl: './users.html',
})
export class Users {
  protected readonly globalService = inject(GlobalService);
  private userService = inject(UserService);
  protected authService = inject(AuthService);

  protected selectedTab = signal<'ACTIVOS' | 'INACTIVOS'>('ACTIVOS');
  selectTab(tab: 'ACTIVOS' | 'INACTIVOS') {
    this.selectedTab.set(tab);
    this.userResource.reload();
  }

  private requestSource = computed(() => {
    if (this.authService.hasVerifierPermission()) return 'PENDIENTES';

    return this.selectedTab() === 'ACTIVOS' ? 'ACTIVOS' : 'INACTIVOS';
  });

  protected userResource = rxResource({
    stream: () => {
      const source = this.requestSource();

      if (source === 'PENDIENTES') {
        return this.userService.userPdfPendientes();
      }

      return this.userService.getAllUsers(source === 'ACTIVOS');
    },
  });

  refresh() {
    this.userResource.reload();
 }

}

export default Users;
