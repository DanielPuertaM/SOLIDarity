import { Component, effect, inject, signal } from '@angular/core';
import { AuthService } from '@auth/services/auth';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, of, throwError } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { GlobalService } from '@core/services/global_service';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BeneficiarioService } from '../service/beneficiario-service';
import { ActivatedRoute, Router } from '@angular/router';
import { PdfService } from '../service/pdf-service';
import { CreateCampaniaForm } from './create-campania-form';
import { CampaniaRequest } from '@core/models/campania';

@Component({
  selector: 'app-create-campania',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-campania.html'
})
export class CreateCampania {
  private beneficiarioService = inject(BeneficiarioService);
  private authService = inject(AuthService);
  private pdfService = inject(PdfService);
  private createCampaniaForm = inject(CreateCampaniaForm)
  protected globalService = inject(GlobalService);
  private location = inject(Location);


  campaniaForm: FormGroup;
  selectedImage: File | null = null;
  previewImage: string | null = null;
  private payloadImage = signal<File | null>(null);
  private payloadCampania = signal<CampaniaRequest | null>(null);
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

  protected uploadImageResource = rxResource({
    params: () => ({
      file: this.payloadImage(),
      createdCampaniaId: this.campaniaResource.value()?.id
    }),
    stream: ({ params }) =>
      params.file && params.createdCampaniaId
        ? this.createCampaniaForm.uploadImage(params.file, params.createdCampaniaId).pipe(
          catchError((err) => {
            const e = new Error(err?.message || 'Error subiendo imagen');
            (e as any).cause = err;
            return throwError(() => e);
          })
        )
        : of(null)
  });

  public onFileImageSelected(event: any) {
    const file = event.target.files[0];

    if (!file) return;

    this.selectedImage = file;

    this.previewImage = URL.createObjectURL(file);
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

  protected campaniaResource = rxResource({
    params: () => ({ payload: this.payloadCampania() }),
    stream: ({ params }) =>
      params.payload ?
        this.createCampaniaForm.createCampania(params.payload).pipe(
          catchError((err) => {
            const e = new Error(err?.message || 'Error obteniendo beneficiario');
            (e as any).cause = err;
            return throwError(() => e);
          })
        ) :
        of(null)

  })

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

  public onCreateCampania() {
    if (!this.campaniaForm.valid) {
      return;
    }

    const id = this.authService.getUserId();

    this.payloadCampania.set({
      ...this.campaniaForm.value,
      idBeneficiario: id
    });
    if (this.selectedImage) {
      this.payloadImage.set(this.selectedImage);
    }
  }


  constructor() {
    this.resourceEffect();
    effect(() => {
      const result = this.uploadImageResource.value();
      if (result) {
        console.log("Imagen subida correctamente");
        this.payloadImage.set(null);
        this.goBack();
      }
    });

    effect(() => {
      const created = this.campaniaResource.value();
       const file = this.payloadImage();
      if (created && !file) {
       this.goBack();
      }
    });


    this.campaniaForm = this.createCampaniaForm.createForm();
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
