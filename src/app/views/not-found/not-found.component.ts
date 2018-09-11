import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../app.component';

@Component({
  selector: 'app-not-found',
  templateUrl: 'not-found.component.html'
})

export class NotFoundComponent implements OnInit {
  constructor(private appComponent: AppComponent) {
  }

  ngOnInit() {
    this.appComponent.title = 'Página não encontrada';
  }
}
