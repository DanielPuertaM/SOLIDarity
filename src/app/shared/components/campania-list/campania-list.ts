import { Component, computed, effect, inject, signal } from '@angular/core';
import { GlobalService } from '@core/services/global_service';
import { CampaniaService } from '../../../user/service/campania-service';
import { rxResource } from '@angular/core/rxjs-interop';
import Campania from '../campania/campania';
import { StatusCampania } from '@core/models/campania';
import { CommonModule } from '@angular/common';
import { AuthService } from '@auth/services/auth';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-campania-list',
  imports: [Campania, CommonModule, RouterLink],
  templateUrl: './campania-list.html',
})
export class CampaniaList {
  protected readonly globalService = inject(GlobalService);
  private campaniaService = inject(CampaniaService);
  protected readonly statusCampania = StatusCampania;
  protected authService = inject(AuthService);
  protected idUser = computed(() => this.authService.getUserId() ?? undefined);
  protected selected = signal<StatusCampania | null>(StatusCampania.EN_PROGRESO);
  protected beneficiarioId = signal<number | null>(null);


  estoyEnCampania(){
    return this.beneficiarioId() !== null;
  }
  
  protected readonly campaniasResource = rxResource({
    params: () => ({
      status: this.selected(),
      beneficiarioId: this.beneficiarioId(),
    }),

    stream: ({ params }) =>
      this.campaniaService.fetchCampañas(
        params.status ?? undefined,
        params.beneficiarioId ?? undefined
      ),
  });

  refresh() {
    this.campaniasResource.reload();
  }

  select(tab: StatusCampania) {
    this.selected.set(tab);
    this.beneficiarioId.set(null); 
  }

  misCampanias(idUsuario: number | undefined) {
    this.beneficiarioId.set(idUsuario ?? null);
    this.selected.set(null); 
  }
}

export default CampaniaList;
