import {NgModule} from '@angular/core';
import {ClientListComponent} from './list/client-list.component';
import {MaterialComponentsModule} from '../../material-components.module';

@NgModule({
  declarations: [ClientListComponent],
  imports: [MaterialComponentsModule]
})
export class ClientModule {
}
