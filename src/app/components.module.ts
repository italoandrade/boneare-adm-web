import {NgModule} from '@angular/core';
import {
  MatBadgeModule,
  MatButtonModule,
  MatCardModule, MatDialogModule, MatExpansionModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule, MatMenuModule, MatPaginatorModule, MatProgressBarModule, MatProgressSpinnerModule, MatSelectModule,
  MatSidenavModule, MatSnackBarModule, MatSortModule, MatTableModule,
  MatToolbarModule, MatTooltipModule
} from '@angular/material';
import {MaskPhoneDirective} from './utils/masks/phone/mask-phone.directive';
import {SmartListComponent} from './utils/smart-list/smart-list.component';
import {SmartListItemComponent} from './utils/smart-list/item/item.component';
import {MaskCepDirective} from './utils/masks/cep/mask-cep.directive';
import {DisplacerComponent, DisplacerPortalDirective} from './utils/displacer';
import {CurrencyMaskModule} from 'ng2-currency-mask';

const components = [
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatSidenavModule,
  MatListModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressBarModule,
  MatDialogModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatMenuModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatTooltipModule,
  MatExpansionModule,
  MatBadgeModule,
  MatSelectModule,

  CurrencyMaskModule
];

@NgModule({
  declarations: [
    MaskPhoneDirective,
    SmartListComponent,
    SmartListItemComponent,
    MaskCepDirective,

    DisplacerComponent,
    DisplacerPortalDirective
  ],
  imports: components,
  exports: components
})
export class ComponentsModule {
}

