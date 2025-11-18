import { Component, inject } from '@angular/core';
import { NavBar } from '../nav-bar/nav-bar';
import { RouterOutlet } from '@angular/router';
import { GlobalService } from '@core/services/global_service';

@Component({
  selector: 'app-dashboard',
  imports: [NavBar,RouterOutlet],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  protected readonly globalService = inject(GlobalService);

  logout(){
    
  }

  constructor() {
  console.log(' Dashboard cargado');
}
}

export default Dashboard;
