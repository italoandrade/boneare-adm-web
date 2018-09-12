import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {UserService} from './user.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar) {
  }

  canActivate(): boolean {
    if (!this.userService.user) {
      this.router.navigate(['sign-in']);
      this.snackBar.open('Para acessar essa página você tem que iniciar a sessão', null, {
        duration: 3000
      });
      return false;
    }
    return true;
  }
}
