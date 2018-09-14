import {NgModule} from '@angular/core';
import {ClientListComponent} from './list/client-list.component';
import {MaterialComponentsModule} from '../../material-components.module';
import {RouterModule} from '@angular/router';
import {MatPaginatorIntl} from '@angular/material';
import {MatPaginatorIntlBra} from '../../utils/matPaginatorIntlBra';
import {BrowserModule} from '@angular/platform-browser';
import {ClientListService} from './list/client-list.service';

@NgModule({
  declarations: [ClientListComponent],
  imports: [
    BrowserModule,
    RouterModule,
    MaterialComponentsModule
  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlBra}, ClientListService]
})
export class ClientModule {
}
