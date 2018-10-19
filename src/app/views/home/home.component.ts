import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';
import {ApiService} from '../../core/services/api.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit {
  loading = true;
  dashboard;

  constructor(public appComponent: AppComponent, private router: Router, private apiService: ApiService, private snackBar: MatSnackBar) {
    this.dashboard = {};
  }

  ngOnInit() {
    this.appComponent.title = '';
    if (!this.appComponent.user) {
      this.router.navigate(['/sign-in']);
    }

    this.apiService
      .prep('dashboard', 'getInfo')
      .call()
      .subscribe(
        res => {
          this.dashboard = res;
        },
        err => {
          this.snackBar.open(err.error.message, null, {
            duration: 3000
          });
        },
        () => this.loading = false
      );
  }
}
