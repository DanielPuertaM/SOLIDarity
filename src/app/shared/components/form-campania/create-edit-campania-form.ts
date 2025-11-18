
import { inject, Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { GlobalService } from '@core/services/global_service';
import { CampaniaRequest, CampaniaResponse, CampaniaUpdateRequest } from '@core/models/campania';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })

export class CreateEditCampaniaForm {
    private fb = inject(FormBuilder);
    private http = inject(HttpClient);
    private globalService = inject(GlobalService);

    public createCampania(payload: CampaniaRequest): Observable<any> {
        return this.http.post<CampaniaResponse>(this.globalService.API_URLS.CAMPAÑAS, payload);

    }

    public  updateCampania(payload: CampaniaUpdateRequest,id: number): Observable<any> {
        return this.http.put<CampaniaResponse>(`${this.globalService.API_URLS.CAMPAÑAS}/${id}`, payload);
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
            titulo: ['', [Validators.required, Validators.minLength(10)]],
            descripcion: ['', [Validators.required, Validators.minLength(20)]],
            montoObjetivo: [null, [Validators.required, Validators.min(10000)]],
        });
    }
}
