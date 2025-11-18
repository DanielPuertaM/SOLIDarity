import { DecimalPipe } from '@angular/common';
import { Component, effect, inject, input, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth';
import { CampaniaResponse, StatusCampania, statusCampaniaRequest } from '@core/models/campania';
import { GlobalService } from '@core/services/global_service';
import { CampaniaService } from '../../../user/service/campania-service';
import { catchError, of, throwError } from 'rxjs';
import { AlertService } from '@shared/components/alertService';

@Component({
  selector: 'app-campania',
  imports: [DecimalPipe],
  templateUrl: './campania.html',
})
export class Campania {
  private router = inject(Router);
  protected globalService = inject(GlobalService);
  protected authService = inject(AuthService);
  private campaniaService = inject(CampaniaService);

  campania = input.required<CampaniaResponse>();

  protected imageLoaded = false;
  protected readonly statusCampania = StatusCampania;
  private payloadStatusCampania = signal<statusCampaniaRequest | null>(null);
  private payloadId = signal<number | null>(null);
  private alertService = inject(AlertService);
  
  misCampanias = input.required<boolean>();
  actionCompleted = output<void>();

  protected statusCampaniaResource = rxResource({
    params: () => ({
      statusCampania: this.payloadStatusCampania(),
      campaniaId: this.payloadId(),
    }),
    stream: ({ params }) =>
      params.statusCampania && params.campaniaId
        ? this.campaniaService.updateCampaniaState(params.campaniaId, params.statusCampania).pipe(
            catchError((err) => {
              const e = new Error(err?.message || 'Error obteniendo beneficiario');
              (e as any).cause = err;
              return throwError(() => e);
            })
          )
        : of(null),
  });

  constructor() {
    effect(() => {
      const res = this.statusCampaniaResource.value();
      if (!res) return;

      if (res.status === 204) {
        this.alertService.showAlert('success', 'Éxito', 'La operación se completó correctamente.');
        this.actionCompleted.emit();
      }
    });
  }

  goToProfile() {
    const id = this.campania().id;
    this.router.navigate(['/user/dashboard-donante/home/campania', id]);
  }

  goToEdit() {  
        const id = this.campania().id;
    this.router.navigate(['/user/dashboard-donante/home/mycampania', id]);
  }

  goToDonation() {
    this.router.navigate(['/user/dashboard-donante/home/campania', this.campania().id, 'donacion']);
  }

  async campaniaAction(Action: string) {
    this.alertService.showConfirm(
      'Confirmar acción',
      '¿Estás seguro?',
      () => {
        this.payloadId.set(this.campania().id);
        this.payloadStatusCampania.set({ status: Action });
      }
    );
  }
}

export default Campania;
