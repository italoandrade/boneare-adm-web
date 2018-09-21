import {LOCALE_ID, NgModule} from '@angular/core';
import {ClientListComponent} from './list/client-list.component';
import {MaterialComponentsModule} from '../../material-components.module';
import {RouterModule} from '@angular/router';
import {MatPaginatorIntl} from '@angular/material';
import {MatPaginatorIntlBra} from '../../utils/matPaginatorIntlBra';
import {BrowserModule} from '@angular/platform-browser';
import {ClientListService} from './list/client-list.service';
import {ClientInfoComponent} from './info/client-info.component';
import {DisplacerComponent, DisplacerPortalDirective} from '../../utils/displacer';
import {FormsModule} from '@angular/forms';
import {registerLocaleData} from '@angular/common';
import localePt from '@angular/common/locales/pt';
import {TextareaAutosizeModule} from 'ngx-textarea-autosize';
import {MaskPhoneDirective} from '../../utils/masks/mask-phone.directive';
import {SmartListComponent} from '../../utils/smart-list/smart-list.component';
import {SmartListItemComponent} from '../../utils/smart-list/item/item.component';

registerLocaleData(localePt, 'pt-BR');

@NgModule({
  declarations: [
    ClientListComponent,
    ClientInfoComponent,

    DisplacerComponent,
    DisplacerPortalDirective,
    MaskPhoneDirective,
    SmartListComponent,
    SmartListItemComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    FormsModule,
    MaterialComponentsModule,
    TextareaAutosizeModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'pt-BR'}, {provide: MatPaginatorIntl, useClass: MatPaginatorIntlBra}, ClientListService]
})
export class ClientModule {
}
