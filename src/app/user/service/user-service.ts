import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { userResponse } from '@auth/models/userResponse';
import { statusPdfRequest } from '@core/models/pdf';
import { GlobalService } from '@core/services/global_service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private globalService = inject(GlobalService);
  private http = inject(HttpClient);

  public userById(id: number): Observable<userResponse> {
    return this.http.get<userResponse>(`${this.globalService.API_URLS.USER}/${id}`);
  }

  public uploadImage(image: File, id: number): Observable<any> {
    const formData = new FormData();
    formData.append('imagen', image);
    return this.http.put(`${this.globalService.API_URLS.USER}/${id}/imagen`, formData);
  }

  public userPdfPendientes(): Observable<userResponse[]> {
    return this.http.get<userResponse[]>(`${this.globalService.API_URLS.USER}/pdf`, {
      params: {
        estado: 'PENDIENTE',
      },
    });
  }

  public getAllUsers(activo: boolean): Observable<userResponse[]> {
    return this.http.get<userResponse[]>(`${this.globalService.API_URLS.USER}`, {
      params: {
        activo: activo ?? true,
      },
    });
  }

  public stateUpdateUser(id: number, state: string): Observable<any> {
    return this.http.put(
      `${this.globalService.API_URLS.USER}/${id}/${state}`,
      {},
      { observe: 'response' }
    );
  }

  public getPdfByUserID(id: number) {
    return this.http.get(`${this.globalService.API_URLS.USER}/${id}/pdf`, { responseType: 'blob' });
  }

  public updateStatePdfByUserId(id: number, statusPdfRequest: statusPdfRequest): Observable<any> {
    return this.http.put(`${this.globalService.API_URLS.USER}/${id}/pdf/status`, statusPdfRequest, {
      observe: 'response',
    });
  }
}
