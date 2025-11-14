import { DecimalPipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth/services/auth';
import { CampaniaResponse, StatusCampania } from '@core/models/campania';
import { GlobalService } from '@core/services/global_service';

@Component({
  selector: 'app-campania',
  imports: [DecimalPipe],
  templateUrl: './campania.html'
})
export class Campania {
  private router = inject(Router);
  protected GlobalService = inject(GlobalService);
  protected authService =  inject(AuthService);
  campania = input.required<CampaniaResponse>();
  protected imageLoaded = false;
  
    protected readonly statusCampania = StatusCampania;


  goToProfile() {
    const id = this.campania().id;
    this.router.navigate(['/user/dashboard-donante/home/campania', id]);
  }

  goToDonation() {
    this.router.navigate([
      '/user/dashboard-donante/home/campania',
      this.campania().id,
      'donacion'
    ]);
  }
}

export default Campania;