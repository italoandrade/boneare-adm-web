import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import {User} from './user.model';
import {ApiService} from '../../utils/api.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: 'sign-in.component.html',
  styleUrls: ['sign-in.component.scss']
})

export class SignInComponent implements OnInit {
  showPassword = false;
  loading = false;
  user = new User();

  constructor(private appComponent: AppComponent, private apiService: ApiService) {
  }

  ngOnInit() {
    this.appComponent.title = 'Iniciar sessão';
  }

  onSubmit(form) {
    this.loading = true;
    if (form.invalid) {
      return this.loading = false;
    }

    this.apiService
      .prep('ping', 'ping')
      // .call()
      // .then((e) => {
      //   console.log(e);
      // });
  }
}
