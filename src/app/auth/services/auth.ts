import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from 'src/app/core/services/global_service';
import { userResponse } from '../models/userResponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private globalService = inject(GlobalService);
  private router = inject(Router);
  private _user = signal<userResponse | null>(null);
  protected _role = signal<string | null>(null);


  public saveCredentials(userResponse: userResponse) {
    localStorage.setItem('user', JSON.stringify(userResponse));
    this._user.set(userResponse);
  }



  
}
