import { Component, effect, inject, input, signal, WritableSignal } from '@angular/core';
import { GlobalService } from '../../../core/services/global_service';
import { LoginRequest } from '../../models/loginRequest';
import { rxResource } from '@angular/core/rxjs-interop';
import { loginFormService } from './services/login-form';
import { catchError, map, of } from 'rxjs';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '@auth/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html'
})
export class Login {
  protected globalService = inject(GlobalService);
  private loginFormService = inject(loginFormService);
  private authService = inject(AuthService);
  public isLogin = input.required<WritableSignal<boolean>>();
  loginForm: FormGroup;


  private payloadLogin = signal<LoginRequest | null>(null);

  protected readonly loginResource = rxResource({
    params: () => ({payload: this.payloadLogin()}),
    stream: ({params}) =>
      params.payload ?
        this.loginFormService.login(params.payload).pipe(
                  map((res) => {
                    if (res === null || res === undefined) {
                      throw new Error("EMPTY_RESPONSE");
                    }
                    return res;
                  }),
                  catchError((err) => {
                    console.error("ERROR REAL:", err);
                    return of({ __error: true });
                  }),
                ):
        of(null)
  });

  private handleLoginResourceEffect() {
    effect(() => {
      if (this.loginResource.error() && this.loginResource.hasValue()) {
        console.log('register error:', this.loginResource.error());
      }

      if (!this.loginResource.hasValue()) return;

      const response = this.loginResource.value();
      if (!response) return;

      this.authService.handleAuthenticated(response);

    });
  }
  
  onLogin() {

    if (!this.loginForm.valid) {
      return;
    }
    this.payloadLogin.set(this.loginForm.value);
  }

  constructor() {
    this.loginForm = this.loginFormService.createForm();
    this.handleLoginResourceEffect();
  }

  protected toggle() {
    this.isLogin().set(false);
  }
}
