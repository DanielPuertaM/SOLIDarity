import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { registerRequest } from 'src/app/auth/models/registerReques';
import { userResponse } from 'src/app/auth/models/userResponse';
import { AuthService } from 'src/app/auth/services/auth';
import { GlobalService } from 'src/app/core/services/global_service';

@Injectable({
  providedIn: 'root',
})
export class RegisterFormService {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private globalService = inject(GlobalService);
  private authService = inject(AuthService);

  public register(payload: registerRequest): Observable<any> {
    return this.http.post<userResponse>(
      this.globalService.API_URLS.REGISTER,
      payload
    )
    .pipe(
      tap( response => this.authService.saveCredentials(response)),
    //   map( response => this.authService.handleAuthSuccess(response)),
    //   catchError(error => this.authService.handleAuthError(error))
     );
  }


  public createForm() {
    return this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      telefono: ['', [Validators.required,
      Validators.pattern(/^[0-9]+$/),
      Validators.minLength(6),],],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required]]
    });
  }
}
