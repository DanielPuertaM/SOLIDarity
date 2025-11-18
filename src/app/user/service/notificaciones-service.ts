import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { notificacionResponse } from '@core/models/notificacion';
import { GlobalService } from '@core/services/global_service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private globalService = inject(GlobalService);
  private http = inject(HttpClient);

  public getNotificaciones(id: number): Observable<notificacionResponse[]>{
    return this.http.get<notificacionResponse[]>(`${this.globalService.API_URLS.NOTIFICATIONS}/${id}`);
  }
}
