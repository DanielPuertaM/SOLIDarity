import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { GlobalService } from '@core/services/global_service';

@Component({
  selector: 'app-landing-page',
  imports: [RouterLink],
  templateUrl: './landing-page.html'
})
export class LandingPage {
  protected globalService = inject(GlobalService);
}

export default LandingPage