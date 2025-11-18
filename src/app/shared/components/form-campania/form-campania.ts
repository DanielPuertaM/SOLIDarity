import { Location } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CreateEditCampaniaForm } from '@shared/components/form-campania/create-edit-campania-form';
import { AuthService } from '@auth/services/auth';
import { CampaniaRequest, CampaniaUpdateRequest } from '@core/models/campania';
import { GlobalService } from '@core/services/global_service';
import { catchError, of, throwError } from 'rxjs';
import { CampaniaService } from '@app/user/service/campania-service';
import { Router } from '@angular/router';
import { AlertService } from '../alertService';

@Component({
  selector: 'app-form-campania',
  imports: [ReactiveFormsModule],
  templateUrl: './form-campania.html',
})
export class FormCampania {
  private authService = inject(AuthService);
  private formService = inject(CreateEditCampaniaForm);
  private campaniaService = inject(CampaniaService);
  protected globalService = inject(GlobalService);
  private router = inject(Router);
  payloadCampaniaId = input<number | null>(null);
  private alertService = inject(AlertService);
  campaniaForm: FormGroup = this.formService.createForm();
  selectedImage: File | null = null;
  previewImage: string | null = null;
  private payloadImage = signal<File | null>(null);
  private payloadCampania = signal<CampaniaRequest | null>(null);
  private payloadCampaniaUpdate = signal<CampaniaUpdateRequest | null>(null);

  protected campaniaUpdateResource = rxResource({
    params: () => ({
      payload: this.payloadCampaniaUpdate(),
      id: this.payloadCampaniaId(),
    }),
    stream: ({ params }) =>
      params.payload && params.id !== null
        ? this.formService
            .updateCampania(params.payload, params.id)
            .pipe(catchError((err) => throwError(() => new Error('Error al actualizar campaña'))))
        : of(null),
  });
  protected campaniaCreateResource = rxResource({
    params: () => ({ payload: this.payloadCampania() }),
    stream: ({ params }) =>
      params.payload
        ? this.formService
            .createCampania(params.payload)
            .pipe(catchError((err) => throwError(() => new Error('Error al crear campaña'))))
        : of(null),
  });

  protected campaniaGetResource = rxResource({
    params: () => ({ id: this.payloadCampaniaId() }),
    stream: ({ params }) =>
      params.id !== null
        ? this.campaniaService.fetchCampaniaById(params.id).pipe(catchError(() => of(null)))
        : of(null),
  });

  protected uploadImageResource = rxResource({
    params: () => ({
      file: this.payloadImage(),
      id: this.payloadCampaniaId() ?? this.campaniaCreateResource.value()?.id,
    }),
    stream: ({ params }) =>
      params.file && params.id ? this.formService.uploadImage(params.file, params.id) : of(null),
  });
  onFileImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedImage = file;
    this.previewImage = URL.createObjectURL(file);
  }

  onCreateCampania() {
    if (this.campaniaForm.invalid) return;

    const idBeneficiario = this.authService.getUserId();

    this.payloadCampania.set({
      ...this.campaniaForm.value,
      idBeneficiario,
    });

    if (this.selectedImage) {
      this.payloadImage.set(this.selectedImage);
    }
  }

  onUpdateCampania() {
    if (this.campaniaForm.invalid) return;

    this.payloadCampaniaUpdate.set({
      ...this.campaniaForm.value,
    });

    if (this.selectedImage) {
      this.payloadImage.set(this.selectedImage);
    }
  }

  constructor() {
    effect(() => {
      const campania = this.campaniaGetResource.value();

      if (campania) {
        this.campaniaForm.patchValue({
          titulo: campania.titulo,
          descripcion: campania.descripcion,
          montoObjetivo: campania.montoObjetivo,
        });

        if (campania.imagenUrl) {
          this.previewImage = campania.imagenUrl;
        }
        this.selectedImage = null;
        this.payloadImage.set(null);
      }
    });

    effect(() => {
      if (this.uploadImageResource.value()) {
        this.payloadImage.set(null);
        this.alertService.showAlert('success', 'Éxito', 'La operación se completó correctamente.');
        this.router.navigate(['/user/dashboard-donante/home'], { replaceUrl: true });
      }
    });

    effect(() => {
      const created = this.campaniaCreateResource.value();
      const update = this.campaniaUpdateResource.value();
      const file = this.payloadImage();

      if (update || (created && !file)) {
        this.alertService.showAlert('success', 'Éxito', 'La operación se completó correctamente.');
        this.router.navigate(['/user/dashboard-donante/home'], { replaceUrl: true });
      }
    });
  }
}
