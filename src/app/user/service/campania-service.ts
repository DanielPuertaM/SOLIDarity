import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CampaniaResponse, CampaniaResponseCompleta, statusCampaniaRequest } from '@core/models/campania';
import { GlobalService } from '@core/services/global_service';
import { List } from 'postcss/lib/list';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CampaniaService {
  private gloabalService = inject(GlobalService);
  private http = inject(HttpClient);

 public fetchCampañas(status?: string, beneficiarioId?: number) {

  const params: any = {};

  if (beneficiarioId !== undefined) {
    params.beneficiarioId = beneficiarioId;
  }

  if (beneficiarioId === undefined && status) {
    params.status = status;
  }

  return this.http.get<CampaniaResponse[]>(
    `${this.gloabalService.API_URLS.CAMPAÑAS}`,
    { params }
  );
}

  public fetchCampaniaById(id: number): Observable<CampaniaResponseCompleta> {
    return this.http.get<CampaniaResponseCompleta>(`${this.gloabalService.API_URLS.CAMPAÑAS}/${id}`);
  }

  public updateCampaniaState(id: number, statusCampaniaRequest: statusCampaniaRequest): Observable<any> { 
      return this.http.put(`${this.gloabalService.API_URLS.CAMPAÑAS}/${id}/estado`,statusCampaniaRequest,{ observe: 'response' });
  }

  

}
