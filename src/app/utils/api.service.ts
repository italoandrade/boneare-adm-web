import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
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

    this.http.get(config.apiUrl).subscribe(
      data => {
        API = data;
      },
      (e) => {
        const dialogRef = this.dialog.open(ApiUnavailableDialog, {
          width: '300px'
        });

        dialogRef.afterClosed().subscribe(() => {
          this.init(config);
        });
      }
    );
  }

  prep(functionality, method) {
    const apiMethod = API[functionality][method];

    return {
      call: data => {
        return this.http[apiMethod.type](this.config.apiHost + apiMethod.path, data);
      }
    };
  }
}
