import {EventEmitter, Injectable} from '@angular/core';
import {ApiService} from './api.service';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class UserService {
  user: any;
  userChange = new EventEmitter();
  token: string;

  constructor(private apiService: ApiService, private snackBar: MatSnackBar) {
  }

  set(user) {
    this.user = user;
    this.userChange.next(user);
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('RNB', token);
    } else {
      localStorage.removeItem('RNB');
    }
  }

  checkToken() {
    let then;

    this.token = localStorage.getItem('RNB');
    if (this.token) {
      this.apiService
        .prep('user', 'signIn')
        .call(null, {'Authentication': this.token})
        .subscribe(
          res => {
            this.set(res.user);
            this.setToken(res.token);
          },
          () => {
            this.set(null);
            localStorage.removeItem('RNB');
            this.snackBar.open('Sua sessão expirou', null, {
              duration: 3000
            });
          },
          () => {
            if (then) {
              then();
            }
          }
        );
    } else {
      this.set(null);
    }

    return {
      then: fn => {
        if (!this.token) {
          fn();
        }
        then = fn;
      }
    };
  }
}

