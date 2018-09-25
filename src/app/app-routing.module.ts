import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {NotFoundComponent} from './views/not-found/not-found.component';
import {SignInComponent} from './views/sign-in/sign-in.component';
import {ReverseAuthGuard} from './core/services/auth.guard';
import {CLIENT_ROUTES} from './views/client/client.routes';
import {PRODUCT_ROUTES} from './views/product/product.routes';

const APP_ROUTES: Routes = [
  {path: '', component: HomeComponent},
  {path: 'sign-in', component: SignInComponent, canActivate: [ReverseAuthGuard]},
  ...CLIENT_ROUTES,
  ...PRODUCT_ROUTES,
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_ROUTES)
  ]
})
export class AppRoutingModule {
}
