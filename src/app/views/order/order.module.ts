import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {OrderListComponent} from './list/order-list.component';
import {ComponentsModule} from '../../core/components/components.module';
import {RouterModule} from '@angular/router';
import {MatPaginatorIntl} from '@angular/material';
import {MatPaginatorIntlBra} from '../../core/utils/matPaginatorIntlBra';
import {BrowserModule} from '@angular/platform-browser';
import {OrderListService} from './list/order-list.service';
import {OrderInfoComponent} from './info/order-info.component';
import {FormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {TextareaAutosizeModule} from 'ngx-textarea-autosize';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    OrderListComponent,
    OrderInfoComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ComponentsModule,
    TextareaAutosizeModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'pt-BR'}, {provide: MatPaginatorIntl, useClass: MatPaginatorIntlBra}, OrderListService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OrderModule {
}
