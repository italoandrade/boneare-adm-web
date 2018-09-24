import {CUSTOM_ELEMENTS_SCHEMA, LOCALE_ID, NgModule} from '@angular/core';
import {ProductListComponent} from './list/product-list.component';
import {ComponentsModule} from '../../components.module';
import {RouterModule} from '@angular/router';
import {MatPaginatorIntl} from '@angular/material';
import {MatPaginatorIntlBra} from '../../utils/matPaginatorIntlBra';
import {BrowserModule} from '@angular/platform-browser';
import {ProductListService} from './list/product-list.service';
import {ProductInfoComponent} from './info/product-info.component';
import {FormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {TextareaAutosizeModule} from 'ngx-textarea-autosize';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    ProductListComponent,
    ProductInfoComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    ComponentsModule,
    TextareaAutosizeModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'pt-BR'}, {provide: MatPaginatorIntl, useClass: MatPaginatorIntlBra}, ProductListService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductModule {
}
