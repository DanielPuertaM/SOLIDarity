import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GlobalService } from '@core/services/global_service';
import { BeneficiarioResponse } from '@core/models/benficiario-status';

@Injectable({
  providedIn: 'root',
})
export class BeneficiarioService {

  private globalService = inject(GlobalService);

  private http = inject(HttpClient);

  public getStatus(userId: number): Observable<BeneficiarioResponse | { status: string }> {
    return this.http.get<BeneficiarioResponse>(`${this.globalService.API_URLS.USER}/${userId}/beneficiario`).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<BeneficiarioResponse | { status: string }> {
    if (error.status === 404) {
      if (error.error && error.error.includes('aún no tiene ningún PDF')) {
       
        return of({ status: 'NOPDF' });
      }
      return throwError(() => new Error('No se encontró el recurso solicitado.'));
    }

    return throwError(() => new Error('Algo salió mal, por favor intente de nuevo.'));
  }
}
