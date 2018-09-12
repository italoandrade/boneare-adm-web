import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiUnavailableDialog} from '../dialogs/api-unavailable.dialog';
import {MatDialog} from '@angular/material';

let API = {};

@Injectable()
export class ApiService {
  config;

  constructor(private http: HttpClient, public dialog: MatDialog) {
  }

  init(config) {
    this.config = config;

    let then;

    this.http.get(config.apiUrl).subscribe(
      data => {
        API = data;
        if (then) {
          then();
        }
      },
      () => {
        const dialogRef = this.dialog.open(ApiUnavailableDialog, {
          width: '300px'
        });

        dialogRef.afterClosed().subscribe(() => {
          this.init(config);
        });
      }
    );


    return {
      then: fn => {
        then = fn;
      }
    };
  }

  prep(functionality, method) {
    const apiMethod = API[functionality][method];

    return {
      call: data => {
        data = data || {};

        let headers = new HttpHeaders();

        const token = localStorage.getItem('RNB');
        if (token) {
          headers = headers.set('Authentication', token);
        }

        return this.http[apiMethod.type](this.config.apiHost + apiMethod.path, data, {headers});
      }
    };
  }
}
