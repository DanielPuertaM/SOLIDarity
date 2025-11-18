import { Injectable, signal } from '@angular/core';

export type AlertType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class AlertService {
  alertVisible = signal(false);
  alertMessage = signal('');
  alertTitle = signal('');
  alertType = signal<AlertType>('info');

  confirmVisible = signal(false);
  confirmMessage = signal('');
  confirmTitle = signal('');
  confirmCallback: (() => void) | null = null;

  showAlert(type: AlertType, title: string, message: string) {
    this.alertType.set(type);
    this.alertTitle.set(title);
    this.alertMessage.set(message);
    this.alertVisible.set(true);
  }

  closeAlert() {
    this.alertVisible.set(false);
  }
  
  showConfirm(title: string, message: string, callback: () => void) {
    this.confirmTitle.set(title);
    this.confirmMessage.set(message);
    this.confirmCallback = callback;
    this.confirmVisible.set(true);
  }

  confirmYes() {
    if (this.confirmCallback) this.confirmCallback();
    this.confirmVisible.set(false);
  }

  confirmNo() {
    this.confirmVisible.set(false);
  }
}
