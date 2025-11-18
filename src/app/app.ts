import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConfirmModalComponent } from '@shared/components/alert-confirm/alert-confirm';
import { AlertModalComponent } from '@shared/components/alert/alert';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,AlertModalComponent,ConfirmModalComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('SOLIDarity');
}
