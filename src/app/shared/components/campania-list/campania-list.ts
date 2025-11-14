import { Component, effect, inject, signal } from '@angular/core';
import { GlobalService } from '@core/services/global_service';
import { CampaniaService } from '../../../user/dashboard-donante/service/campania-service';
import { rxResource } from '@angular/core/rxjs-interop';
import Campania from '../../../user/dashboard-donante/campania/campania';
import { StatusCampania } from '@core/models/campania';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth/services/auth';

@Component({
  selector: 'app-campania-list',
  imports: [Campania,CommonModule],
  templateUrl: './campania-list.html',
})
export class CampaniaList {

  protected readonly globalService = inject(GlobalService);
  private campaniaService = inject(CampaniaService);
  protected readonly statusCampania = StatusCampania;
  protected authService = inject(AuthService);


  selected = signal<StatusCampania>(StatusCampania.EN_PROGRESO);

  protected readonly campaniasResource = rxResource({
    params: () => ({payload: this.selected()}),
    stream: ({params}) => this.campaniaService.fetchCampañas(params.payload)

  });

  select(tab: StatusCampania) {
    this.selected.set(tab);
  }


}

export default CampaniaList;
