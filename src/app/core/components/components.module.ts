import {NgModule} from '@angular/core';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import {MaskPhoneDirective} from '../masks/phone/mask-phone.directive';
import {SmartListComponent} from './smart-list/smart-list.component';
import {SmartListItemComponent} from './smart-list/item/item.component';
import {MaskCepDirective} from '../masks/cep/mask-cep.directive';
import {DisplacerComponent, DisplacerPortalDirective} from '../utils/displacer';
import {CurrencyMaskModule} from 'ng2-currency-mask';

const COMPONENT_MODULES = [
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
  MatAutocompleteModule,

  CurrencyMaskModule
];

const COMPONENTS = [
  MaskPhoneDirective,
  SmartListComponent,
  SmartListItemComponent,
  MaskCepDirective,

  DisplacerComponent,
  DisplacerPortalDirective
];

@NgModule({
  declarations: COMPONENTS,
  imports: COMPONENT_MODULES,
  exports: [...COMPONENT_MODULES, ...COMPONENTS]
})
export class ComponentsModule {
}

