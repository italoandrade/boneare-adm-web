import {NgModule} from '@angular/core';
import {ClientListComponent} from './list/client-list.component';
import {MaterialComponentsModule} from '../../material-components.module';
import {RouterModule} from '@angular/router';
import {MatPaginatorIntl} from '@angular/material';
import {MatPaginatorIntlBra} from '../../utils/matPaginatorIntlBra';
import {BrowserModule} from '@angular/platform-browser';
import {ClientListService} from './list/client-list.service';
import {ClientInfoComponent} from './info/client-info.component';

@NgModule({
  declarations: [
    ClientListComponent,
    ClientInfoComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    MaterialComponentsModule
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlBra}, ClientListService]
})
export class ClientModule {
}
