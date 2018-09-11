import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../app.component';
import {User} from './user.model';

@Component({
  selector: 'app-sign-in',
  templateUrl: 'sign-in.component.html',
  styleUrls: ['sign-in.component.scss']
})

export class SignInComponent implements OnInit {
  showPassword = false;
  loading = false;
  user = new User();

  constructor(private appComponent: AppComponent) {
  }

  ngOnInit() {
    this.appComponent.title = 'Iniciar sessão';
  }

  onSubmit(form) {
    console.log(form);
    if (form.valid) {
      console.log('valid');
    }
    console.log(this.user);
    this.loading = true;
  }
}
