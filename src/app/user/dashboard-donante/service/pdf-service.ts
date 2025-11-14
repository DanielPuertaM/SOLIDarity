import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { GlobalService } from '@core/services/global_service';

@Injectable({
  providedIn: 'root',
})
export class PdfService {
  private globalService = inject(GlobalService);
  private http = inject(HttpClient);

  public uploadPdfByUser(id: number, file: File) {[]
    const formData = new FormData();
    formData.append('file', file, file.name); 

    return this.http.post(`${this.globalService.API_URLS.USER}/${id}/pdf`, formData,{ responseType: 'text' });
  }

}
