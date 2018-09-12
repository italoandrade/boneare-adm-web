import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class UserService {
  user: any;
  userChange = new EventEmitter();
  token: string;

  constructor() {
  }

  set(user) {
    this.user = user;
    this.userChange.next(user);
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('RNB', token);
  }
}

