import {Routes} from '@angular/router';
import {AuthGuard} from '../../core/services/auth.guard';
import {OrderInfoComponent} from './info/order-info.component';
import {OrderListComponent} from './list/order-list.component';

export const ORDER_ROUTES: Routes = [
  {path: 'order', component: OrderListComponent, canActivate: [AuthGuard]},
  {path: 'orders', redirectTo: 'order'},
  {path: 'order/add', component: OrderInfoComponent, canActivate: [AuthGuard]},
  {path: 'order/:id', component: OrderInfoComponent, canActivate: [AuthGuard]}
];
