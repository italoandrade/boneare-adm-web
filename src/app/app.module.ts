import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';

import {AuthGuard, ReverseAuthGuard} from './core/services/auth.guard';
import {ApiService} from './core/services/api.service';
import {UserService} from './core/services/user.service';

import {ComponentsModule} from './core/components/components.module';

import {HomeComponent} from './views/home/home.component';
import {NotFoundComponent} from './views/not-found/not-found.component';
import {SignInComponent} from './views/sign-in/sign-in.component';
import {ClientModule} from './views/client/client.module';
import {ProductModule} from './views/product/product.module';

import {ApiUnavailableDialog} from './dialogs/api-unavailable.dialog';

@NgModule({
  declarations: [
    AppComponent,

    HomeComponent,
    NotFoundComponent,
    SignInComponent,

    ApiUnavailableDialog
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FormsModule,
    HttpClientModule,

    AppRoutingModule,

    ComponentsModule,

    ClientModule,
    ProductModule
  ],
  providers: [ApiService, UserService, AuthGuard, ReverseAuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [ApiUnavailableDialog]
})
export class AppModule {
}
