import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {UserService} from './user.service';
import {MatSnackBar} from '@angular/material';
import {Observable} from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar) {
  }

  canActivate(): any {
    if (typeof this.userService.user === 'undefined') {
      return new Observable((observer) => {
        const timeout = setTimeout(() => {
          observer.next(false);
          this.router.navigate(['/']);
          this.snackBar.open('Tempo para verificar sua sessão esgotou', null, {
            duration: 3000
          });
        }, 60000);

        this.userService.userChange.subscribe(user => {
          clearTimeout(timeout);
          observer.next(!!user);
          if (!user) {
            this.router.navigate(['sign-in']);
            this.snackBar.open('Para acessar essa página você tem que iniciar a sessão', null, {
              duration: 3000
            });
          }
        });
      });
    } else {
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
}

@Injectable()
export class ReverseAuthGuard implements CanActivate {
  constructor(private userService: UserService, private router: Router, private snackBar: MatSnackBar) {
  }

  canActivate(): boolean {
    if (this.userService.user) {
      this.router.navigate(['/']);
      this.snackBar.open('Você já está com a sessão iniciada', null, {
        duration: 3000
      });
      return false;
    }
    return true;
  }
}
