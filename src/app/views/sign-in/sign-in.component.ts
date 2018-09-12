import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import {ApiService} from '../../utils/api.service';
import {UserService} from '../../utils/user.service';
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
      email: 'test@test.comd',
      password: 'test'
    };
    // REMOVE
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
      .prep('user', 'signIn')
      .call(this.user)
      .subscribe(
        res => {
          this.router.navigate(['/']);
          this.userService.set(res.user);
          this.userService.setToken(res.token);
        },
        err => {
          this.loading = false;
          setTimeout(() => {
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
          });
          console.log(form.controls);
        }
      );
  }
}
