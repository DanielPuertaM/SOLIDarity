import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@auth/services/auth';
import { catchError, map, Observable, tap } from 'rxjs';
import { LoginRequest } from 'src/app/auth/models/loginRequest';
import { userResponse } from 'src/app/auth/models/userResponse';
import { GlobalService } from 'src/app/core/services/global_service';

@Injectable({
  providedIn: 'root',
})
export class loginFormService {
  private fb = inject(FormBuilder);
  private readonly globalService = inject(GlobalService);
  private authService = inject(AuthService);
  private http = inject(HttpClient);

  public login(payload: LoginRequest): Observable<any> {
    return this.http.post<userResponse>(
      this.globalService.API_URLS.LOGIN,
      payload
    )
      .pipe(
        tap(response => this.authService.saveCredentials(response)),
        map(response => this.authService.handleAuthSuccess(response))
      );
  }

  public createForm() {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

}
