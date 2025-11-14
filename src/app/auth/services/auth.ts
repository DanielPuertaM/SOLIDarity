import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/core/services/global_service';
import { userResponse } from '../models/userResponse';
import { AuthStatus } from '@core/models/auth-status.type';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private globalService = inject(GlobalService);
  private router = inject(Router);
  private _authStatus = signal<AuthStatus | null>(null);
  private _user = signal<userResponse | null>(this.loadUserFromStorage());
  protected _role = signal<string | null>(this.loadRoleFromStorage());


  public saveCredentials(userResponse: userResponse) {
    let role = Role.DONOR;
    if (userResponse.email === "admin@gmail.com") {
      role = Role.ADMIN;
    }

    localStorage.setItem('Role', role);
    localStorage.setItem('User', JSON.stringify(userResponse));

    this._role.set(role);
    this._user.set(userResponse);
  }



  public signOut() {
    this.logout();
    this.router.navigate(['/auth']).then();
  }

  public getUserId(): number | null {
    return this._user()?.id ?? null;
  }

  public getRole(): string | null {
    return this._role();
  }

  public hasAdminPermission() {
    return this._role() === Role.ADMIN;
  }

  private logout(): void {
    this._user.set(null);
    this._role.set(null);
    this._authStatus.set('not-authenticated');
    localStorage.removeItem('User');
    localStorage.removeItem('Role');
  }
  public handleAuthSuccess(userResponse: userResponse) {
    this._user.set(userResponse);
    this._authStatus.set('authenticated');
    return true;
  }

  public login(userResponse: userResponse) {

  }

  public handleAuthenticated(response: boolean) {
    if (!response) return;
    console.log('Authenticated successfully');
    if (this.hasAdminPermission()) {
      this.redirectToDashBoard(Role.ADMIN);
      return;
    }
    this.redirectToDashBoard(Role.DONOR);
  }

  public redirectToDashBoard(user: Role) {
    switch (user) {
      case Role.DONOR:
        this.router.navigateByUrl('/user/dashboard-donante/home').then();
        break;
      case Role.ADMIN:
        this.router.navigateByUrl('/user/dashboard-admin/home').then();
        break;

    }
  }

  private loadUserFromStorage(): userResponse | null {
    const storedUser = localStorage.getItem('User');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser) as userResponse;
    } catch {
      return null;
    }
  }


  private loadRoleFromStorage(): string | null {
    const storedUser = localStorage.getItem('User');
    if (!storedUser) return null;
    try {
      let user= JSON.parse(storedUser) as userResponse;
      if(user.email==="admin@gmail.com"){
        localStorage.setItem('Role', Role.ADMIN);
        return Role.ADMIN;
      }else{
        localStorage.setItem('Role', Role.DONOR);
        return Role.DONOR;
      }
    } catch {
      return null;
    }

  }

  public isLogged(): boolean {
    return !!this._user();
  }



}

export enum Role {
  DONOR = 'Donante',
  BENEFICIARY = 'Beneficiario',
  ADMIN = 'Admin',
}
