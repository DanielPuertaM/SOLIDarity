import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GlobalService } from '@core/services/global_service';
import { DonacionService } from '../../../service/donacion-service';
import { DonacionRequest } from '@core/models/donacion';
import { Observable } from 'rxjs';
import { FormBuilder, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class DonacionForm {
  private globalService = inject(GlobalService);
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);


  public donation(payload: DonacionRequest): Observable<any> {
    return this.http.post<DonacionRequest>(`${this.globalService.API_URLS.DONACIONES}`,
      payload);
  }

  public createForm() {
    return this.fb.group({
      monto: [
        null,
        [Validators.required, Validators.min(1000)]
      ],
    });
  }
}
