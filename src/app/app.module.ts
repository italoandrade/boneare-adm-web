import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialComponentsModule} from './material-components.module';
import {RouterModule} from '@angular/router';
import {HomeComponent} from './views/home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {NotFoundComponent} from './views/not-found/not-found.component';
import {SignInComponent} from './views/sign-in/sign-in.component';
import {FormsModule} from '@angular/forms';
import {ApiService} from './utils/api.service';
import {HttpClientModule} from '@angular/common/http';
import {ApiUnavailableDialog} from './dialogs/api-unavailable.dialog';
import {UserService} from './utils/user.service';
import {AuthGuard} from './utils/auth.guard';

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
    MaterialComponentsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ApiService, UserService, AuthGuard],
  bootstrap: [AppComponent],
  entryComponents: [ApiUnavailableDialog]
})
export class AppModule {
}
