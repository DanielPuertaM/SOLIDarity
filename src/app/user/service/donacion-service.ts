import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DonacionRequest, DonacionResponse } from '@core/models/donacion';
import { GlobalService } from '@core/services/global_service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DonacionService {
  private globalService = inject(GlobalService);
  private http = inject(HttpClient);

  public createDonation(donationRequest: DonacionRequest): Observable<DonacionResponse> {
    return this.http.post<DonacionResponse>(`${this.globalService.API_URLS.DONACIONES}`, donationRequest);

  }

}
