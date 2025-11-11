import { Component, effect, inject, input, OnInit, signal, WritableSignal } from '@angular/core';
import { GlobalService } from '../../../core/services/global_service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegisterFormService } from './services/register-form';
import { registerRequest } from '../../models/registerReques';
import { catchError, finalize, map, of } from 'rxjs';
import { rxResource } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule],
  templateUrl: './register.html'
})
export class Register implements OnInit {
  protected globalService = inject(GlobalService);
  private registerFormService = inject(RegisterFormService);
  public isLogin = input.required<WritableSignal<boolean>>();
  registerForm: FormGroup

  public payloadRegister = signal<registerRequest | null>(null);

  protected readonly registerResource = rxResource({
  params: () => ({ payload: this.payloadRegister() }),
  stream: ({ params }) =>
    params.payload
      ? this.registerFormService.register(params.payload).pipe(
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
        )
      : of(null)
});


  private handleRegisterResourceEffect() {
    effect(() => {
      if (this.registerResource.error() && this.registerResource.hasValue()) {
        console.log('register error:', this.registerResource.error());
      }

      if (this.registerResource.hasValue()) {
        
      }

    });
  }

  onRegister() {

    if (!this.registerForm.valid) {
      return;
    }

    this.payloadRegister.set(this.registerForm.value);

  }

  constructor() {
    this.registerForm = this.registerFormService.createForm();
    this.handleRegisterResourceEffect();

  }

  ngOnInit(): void {
    window.scroll(0, 0);
  }

  protected toggle() {
    this.isLogin().set(true);
  }
}
