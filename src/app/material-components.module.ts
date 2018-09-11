import {NgModule} from '@angular/core';
import {
  MatButtonModule,
  MatCardModule, MatDialogModule,
  MatFormFieldModule,
  MatIconModule, MatInputModule,
  MatListModule, MatProgressBarModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';

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
  MatDialogModule
];

@NgModule({
  imports: components,
  exports: components
})
export class MaterialComponentsModule {
}

