import { Component, inject } from '@angular/core';
import { AlertService } from '../alertService';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './alert-confirm.html'
})
export class ConfirmModalComponent {
  alert = inject(AlertService);
}
