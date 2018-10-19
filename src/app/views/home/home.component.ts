import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';
import {Router} from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.component.html',
  styleUrls: ['home.component.scss']
})

export class HomeComponent implements OnInit {
  constructor(public appComponent: AppComponent, private router: Router) {
  }

  ngOnInit() {
    this.appComponent.title = '';
    if (!this.appComponent.user) {
      this.router.navigate(['/signin']);
    }
  }
}
