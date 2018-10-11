import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import {ApiService} from '../../core/services/api.service';
import {UserService} from '../../core/services/user.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sign-in',
  templateUrl: 'sign-in.component.html',
  styleUrls: ['sign-in.component.scss']
})

export class SignInComponent implements OnInit {
  showPassword = false;
  loading = false;
  user: any = {};

  constructor(private appComponent: AppComponent, private apiService: ApiService, private userService: UserService,
              private snackBar: MatSnackBar, private router: Router) {
    this.user = {
      email: 'test@test.com',
      password: 'test'
    };
    // REMOVE
  }

  ngOnInit() {
    this.appComponent.title = 'Iniciar sessão';

    if (this.userService.user) {
      this.router.navigate(['/']);
      setTimeout(() => {
        this.snackBar.open('Você já está com a sessão iniciada', null, {
          duration: 3000
        });
      });
    }
  }

  onSubmit(form) {
    this.loading = true;
    if (form.invalid) {
      return this.loading = false;
    }

    this.apiService
      .prep('user', 'signIn')
      .call(this.user)
      .subscribe(
        res => {
          this.userService.set(res.user);
          this.userService.setToken(res.token);
          this.router.navigate(['/']);
        },
        err => {
          this.loading = false;
          setTimeout(() => {
            if (err.error) {
              switch (err.error.code) {
                case 1:
                  this.snackBar.open(err.error.message, null, {
                    duration: 3000
                  });
                  form.controls['email'].setErrors({notFound: true});
                  break;
                case 2:
                  this.snackBar.open(err.error.message, null, {
                    duration: 3000
                  });
                  form.controls['password'].setErrors({wrong: true});
                  break;
              }
              if (err.status === 500) {
                this.snackBar.open('Ocorreu um erro interno. Tente novamente mais tarde.', null, {
                  duration: 3000
                });
              }
            } else {
              console.error(err);
            }
          });
        }
      );
  }
}
