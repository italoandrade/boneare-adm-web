import {Routes} from '@angular/router';
import {AuthGuard} from '../../core/services/auth.guard';
import {ProductInfoComponent} from './info/product-info.component';
import {ProductListComponent} from './list/product-list.component';

export const PRODUCT_ROUTES: Routes = [
  {path: 'product', component: ProductListComponent, canActivate: [AuthGuard]},
  {path: 'products', redirectTo: 'product'},
  {path: 'product/add', component: ProductInfoComponent, canActivate: [AuthGuard]},
  {path: 'product/:id', component: ProductInfoComponent, canActivate: [AuthGuard]}
];
