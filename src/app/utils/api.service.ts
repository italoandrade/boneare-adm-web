import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ApiUnavailableDialog} from '../dialogs/api-unavailable.dialog';
import {MatDialog} from '@angular/material';

let API = {};

@Injectable()
export class ApiService {
  constructor(private http: HttpClient, public dialog: MatDialog) {
  }

  init(config) {
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

  }
}
