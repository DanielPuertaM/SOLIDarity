import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { CampaniaResponse, CampaniaResponseCompleta } from '@core/models/campania';
import { GlobalService } from '@core/services/global_service';
import { List } from 'postcss/lib/list';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CampaniaService {
  private gloabalService = inject(GlobalService);
  private http = inject(HttpClient);

  public fetchCampañas(status: string): Observable<CampaniaResponse[]> {
    return this.http.get<CampaniaResponse[]>(`${this.gloabalService.API_URLS.CAMPAÑAS}`,
      {
        params: {
          "status": status
        }

      }
    );
  }

  public fetchCampaniaById(id: number): Observable<CampaniaResponseCompleta> {
    return this.http.get<CampaniaResponseCompleta>(`${this.gloabalService.API_URLS.CAMPAÑAS}/${id}`);
  }

  

}
