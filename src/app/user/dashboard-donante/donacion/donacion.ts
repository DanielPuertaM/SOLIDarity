import { DatePipe, DecimalPipe, Location } from '@angular/common';
import { Component, effect, inject, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalService } from '@core/services/global_service';
import { DonacionService } from '../service/donacion-service';
import { DonacionRequest } from '@core/models/donacion';
import { DonacionForm } from './services/donacion-form';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { AuthService } from '@auth/services/auth';

@Component({
  selector: 'app-donacion',
  imports: [ReactiveFormsModule, DecimalPipe,DatePipe],
  templateUrl: './donacion.html'
})
export class Donacion {
  private location = inject(Location);
  protected globalService = inject(GlobalService);
  private route = inject(ActivatedRoute);
  private donacionFormService = inject(DonacionForm);
  private authService = inject(AuthService);
  donacionForm: FormGroup;


  protected loading = signal(false);


  readonly montosFijos = [10000, 20000, 50000, 100000];

  goBack() {
    this.location.back();
  }

  private payloadDonacion = signal<DonacionRequest | null>(null);

  protected donacionResource = rxResource({
    params: () => ({ payload: this.payloadDonacion() }),
    stream: ({ params }) =>
      params.payload ? this.donacionFormService.donation(params.payload)
        : of(null)
  })

  seleccionarMonto(monto: number) {
    this.donacionForm.patchValue({ monto: monto });
  }
  constructor() {
    this.donacionForm = this.donacionFormService.createForm();
    this.handleDonacionResourceEffect();
  }

  private handleDonacionResourceEffect() {
    effect(() => {
      if (this.donacionResource.error() && this.donacionResource.hasValue()) {
        console.log('register error:', this.donacionResource.error());
      }
      
      if (!this.donacionResource.hasValue()) return;
      const res = this.donacionResource.value();
      if(!res)return;

      this.loading.set(false);
      
    })
  }


  onSubmit() {
    if (this.donacionForm.invalid) return;

    const campaniaId = Number(this.route.snapshot.paramMap.get('id'));
    this.loading.set(true);
    const payload: DonacionRequest = {
      monto: this.donacionForm.value.monto,
      idUser: this.authService.getUserId()!,
      idCampaña: campaniaId,
    };

    this.payloadDonacion.set(payload);

  }
}

export default Donacion;  