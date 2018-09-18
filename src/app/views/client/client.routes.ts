import {Routes} from '@angular/router';
import {AuthGuard} from '../../utils/auth.guard';
import {ClientInfoComponent} from './info/client-info.component';
import {ClientListComponent} from './list/client-list.component';

export const CLIENT_ROUTES: Routes = [
  {path: 'clients', component: ClientListComponent, canActivate: [AuthGuard]},
  {path: 'client/add', component: ClientInfoComponent, canActivate: [AuthGuard]},
  {path: 'client/:id', component: ClientInfoComponent, canActivate: [AuthGuard]},
];
