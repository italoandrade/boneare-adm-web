import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {NotFoundComponent} from './views/not-found/not-found.component';
import {SignInComponent} from './views/sign-in/sign-in.component';
import {AuthGuard} from './utils/auth.guard';

const appRoutes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'clients', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'sign-in', component: SignInComponent},
  {path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ]
})
export class AppRoutingModule {
}

