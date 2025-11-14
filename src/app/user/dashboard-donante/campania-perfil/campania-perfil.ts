import { Component, effect, inject, signal } from '@angular/core';
import { GlobalService } from '@core/services/global_service';
import { CampaniaService } from '../service/campania-service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe, DecimalPipe, Location } from '@angular/common';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Component({
  selector: 'app-campania-perfil',
  imports: [DecimalPipe,DatePipe],
  templateUrl: './campania-perfil.html'
})
export class CampaniaPerfil {

  protected globalService = inject(GlobalService);
  private campaniaService = inject(CampaniaService);
  private route = inject(ActivatedRoute);
  
  private location = inject(Location);

    protected imagenLoaded = false;
  protected imagenError = false;


  goBack() {
    this.location.back();
  }

  private payloadId = signal<number | null>(null);

  protected profileResource = rxResource({
    params: () => ({ payload: this.payloadId() }),
    stream: ({ params }) =>
      params.payload ? this.campaniaService.fetchCampaniaById(params.payload,) : of(null)
  });



  constructor() {

    effect(() => {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.payloadId.set(id);
      }
    });
  }

}

export default CampaniaPerfil;