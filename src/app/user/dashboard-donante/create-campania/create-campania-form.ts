
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CampaniaService } from '../service/campania-service';
import { Router } from '@angular/router';
import { GlobalService } from '@core/services/global_service';
import { CampaniaRequest, CampaniaResponse } from '@core/models/campania';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class CreateCampaniaForm {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private globalService = inject(GlobalService);

    public createCampania(payload: CampaniaRequest): Observable<any> {
        return this.http.post<CampaniaResponse>(this.globalService.API_URLS.CAMPAÑAS, payload);

    }

    public uploadImage(image: File, id: number): Observable<any> {
        const formData = new FormData();
        formData.append('imagen', image);
        return this.http.put(
            `${this.globalService.API_URLS.CAMPAÑAS}/${id}/imagen`,
            formData
        );
    }

    public createForm() {
        return this.fb.group({
            titulo: ['', [Validators.required, Validators.minLength(3)]],
            descripcion: ['', [Validators.required, Validators.minLength(10)]],
            montoObjetivo: [null, [Validators.required, Validators.min(10000)]],
        });
    }
}
