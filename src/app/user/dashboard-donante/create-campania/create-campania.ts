import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '@auth/services/auth';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of, throwError } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { GlobalService } from '@core/services/global_service';
import { BeneficiarioService } from '../../service/beneficiario-service';
import { PdfService } from '../../service/pdf-service';
import { FormCampania } from '@shared/components/form-campania/form-campania';

@Component({
  selector: 'app-create-campania',
  imports: [CommonModule,FormCampania],
  templateUrl: './create-campania.html'
})
export class CreateCampania {
  private beneficiarioService = inject(BeneficiarioService);
  private authService = inject(AuthService);
  private pdfService = inject(PdfService);
  protected globalService = inject(GlobalService);
  private location = inject(Location);

  private payloadId = signal<number | null>(null);
  private payloadFile = signal<File | null>(null);

  protected beneficiarioResource = rxResource({
    params: () => ({ payload: this.payloadId() }),
    stream: ({ params }) =>
      params.payload
        ? this.beneficiarioService.getStatus(params.payload).pipe(
          catchError((err) => {
            const e = new Error(err?.message || 'Error obteniendo beneficiario');
            (e as any).cause = err;
            return throwError(() => e);
          })
        )
        : of(null)
  });

    goBack() {
    this.location.back();
  }



  protected pdfResource = rxResource({
    params: () => ({
      payloadId: this.payloadId(),
      selectedFile: this.payloadFile()
    }),
    stream: ({ params }) =>
      params.payloadId && params.selectedFile
        ? this.pdfService.uploadPdfByUser(params.payloadId, params.selectedFile).pipe(
          catchError((err) => {
            const e = new Error(err?.message || 'Error subiendo PDF');
            (e as any).cause = err;
            return throwError(() => e);
          })
        )
        : of(null)
  });

 

  selectedFile: File | null = null;

  public resourceEffect() {
    effect(() => {
      const id = this.authService.getUserId();
      if (id) {
        this.payloadId.set(id);
      }

      const result = this.pdfResource.value();

      if (result) {
        setTimeout(() => {
          this.beneficiarioResource.reload();
          this.payloadFile.set(null);
          this.selectedFile = null;
        }, 700);
      }
    });
  }

  


  constructor() {
    this.resourceEffect();
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  handleUpload() {
    if (!this.selectedFile) return;
    this.payloadFile.set(this.selectedFile);
  }
}

export default CreateCampania;
