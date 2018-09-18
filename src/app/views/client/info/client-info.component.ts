import {Component, OnInit} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-client-info',
  templateUrl: 'client-info.component.html',
  styleUrls: ['client-info.component.scss']
})

export class ClientInfoComponent implements OnInit {
  info;

  constructor(private appComponent: AppComponent, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.appComponent.title = 'Clientes';
    let infoFromTable: any = sessionStorage.getItem('info');
    try {
      infoFromTable = infoFromTable && JSON.parse(infoFromTable);
    } catch (e) {
    }
    const id = this.route.snapshot.params['id'];
    if (+id === infoFromTable.id) {
      this.info = infoFromTable;
    }
    console.log(id);
    console.log(infoFromTable);
  }
}
