import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { Login } from '../pages/login/login';
import { Register } from '../pages/register/register';

@Component({
  selector: 'app-auth.component',
  imports: [Login,Register],
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit {
  isLogin = signal<boolean>(true);

  ngOnInit(): void {
    window.scroll(0,0);
  }

}

export default AuthComponent;