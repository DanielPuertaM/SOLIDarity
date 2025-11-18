import { Component, inject } from '@angular/core';
import { AlertService } from '../alertService';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert.html'
})
export class AlertModalComponent {
  alert = inject(AlertService);
}
