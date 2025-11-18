import { Component, effect, inject, input, output, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { UserService } from '@app/user/service/user-service';
import { userResponse } from '@auth/models/userResponse';
import { StatusCampania } from '@core/models/campania';
import { of } from 'rxjs';
import { AlertService } from '../alertService';
import { statuspdf, statusPdfRequest } from '@core/models/pdf';
import { AuthService } from '@auth/services/auth';

@Component({
  selector: 'app-user-card',
  imports: [],
  templateUrl: './user-card.html',
})
export class UserCard {
  private userService = inject(UserService);
  protected authService = inject(AuthService);
  estado = input.required<'ACTIVOS' | 'INACTIVOS'>();
  user = input.required<userResponse>();

  imagenLoaded = false;

  private descargarId = signal<number | null>(null);
  private abrirId = signal<number | null>(null);
  private payloadIdUserState = signal<number | null>(null);
  private payloadStatus = signal<statusPdfRequest|null>(null);
  private payloadId = signal<number | null>(null);
  private alertService = inject(AlertService);
  protected readonly statusPdf = statuspdf;
  private payloadState = signal<string|null>(null);

   actionCompleted = output<void>();

  protected statusPdfResource = rxResource({  
    params: () => ({ 
      status: this.payloadStatus(), 
      id: this.payloadId() }),
    stream: ({ params }) => (
      params.status && params.id ?
       this.userService.updateStatePdfByUserId(params.id, params.status).pipe() :
        of(null)),

  }
  )
  
  protected pdfResource = rxResource({
    params: () => ({ id: this.descargarId(),
      
     }),
    stream: ({ params }) => (params.id ? this.userService.getPdfByUserID(params.id) : of(null)),
  });

  protected userStateResource = rxResource({
    params: () => ({ id: this.payloadIdUserState(),
      state: this.payloadState(),
     }),
    stream: ({ params }) => (params.id &&params.state ? this.userService.stateUpdateUser(params.id,params.state) : of(null)),
  });

  protected pdfWindowResource = rxResource({
    params: () => ({ id: this.abrirId() }),
    stream: ({ params }) => (params.id ? this.userService.getPdfByUserID(params.id) : of(null)),
  });


  public pdfDowloadEffect() {
    effect(() => {
      const blob = this.pdfResource.value();

      if (blob instanceof Blob) {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `documento_${this.descargarId()}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);

        this.descargarId.set(null);
      }
    });
    
  }
  public pdfOpenWindowEffect() { 
    effect(() => {
  const blob = this.pdfWindowResource.value();

  if (blob instanceof Blob) {
    const url = window.URL.createObjectURL(blob);

    window.open(url, '_blank');

    setTimeout(() => URL.revokeObjectURL(url), 2000);
    this.abrirId.set(null);
  }
});



  }

  
  public statusPdfEffect() {
    effect(() => {
      const res = this.statusPdfResource.value();
      if (!res) return;

      if (res.status === 200) {
        this.alertService.showAlert('success', 'Éxito', 'La operación se completó correctamente.');
        this.actionCompleted.emit();
      }
    });
  }

  public userStatusEffect() {
    effect(() => {
      const res = this.userStateResource.value();
      console.log(res)
      if (!res) return;

      if (res.status === 200) {
        this.alertService.showAlert('success', 'Éxito', 'La operación se completó correctamente.');
        this.actionCompleted.emit();
      }
    });
  }

  async userStateAction() {
    this.alertService.showConfirm(
      'Confirmar acción',
      '¿Estás seguro?',
      () => {
        this.payloadIdUserState.set(this.user().id);
        if(this.estado()==="ACTIVOS"){
          this.payloadState.set("deactivate");
        }else{
          this.payloadState.set("activate");
        }
      }
    );
  }

  async pdfAction(Action: string) {
    this.alertService.showConfirm(
      'Confirmar acción',
      '¿Estás seguro?',
      () => {
        this.payloadId.set(this.user().id);
        this.payloadStatus.set({ statusPDF: Action });
      }
    );
  }

  constructor() {
    this.pdfDowloadEffect();
    this.pdfOpenWindowEffect();
    this.statusPdfEffect();
    this.userStatusEffect();
  }
  descargarPdf(id: number) {
    this.descargarId.set(id);
  }

  abrirPdf(id: number) {
    this.abrirId.set(id);
  }

}
