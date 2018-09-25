import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {ApiService} from './core/services/api.service';
import {environment} from '../environments/environment';
import {UserService} from './core/services/user.service';
import {Router} from '@angular/router';
import {isColorBright} from './core/functions/is-color-bright.function';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  navOpened: boolean;
  @ViewChild('snav') snav;
  title: string;
  user: any;
  readyToGo = false;
  loading = true;
  isColorBright = isColorBright;

  constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher, private apiService: ApiService,
              private userService: UserService, private router: Router) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.apiService.init({
      apiUrl: environment.apiHost + environment.apiRoutes,
      apiHost: environment.apiHost,
    }).subscribe(
      () => {
        this.userService.checkToken().then(() => {
          this.readyToGo = true;
          this.loading = false;
        });
      },
      () => {
        this.readyToGo = false;
        this.loading = false;
      },
      () => {
        this.loading = true;
      }
    );
    this.userService.userChange.subscribe(user => this.user = user);
  }

  ngOnInit() {
    this.navOpened = <any>localStorage.getItem('snav');
    this.snav.openedChange.subscribe(state => {
      localStorage.setItem('snav', state);
    });
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  signOut() {
    this.userService.set(null);
    this.userService.setToken(null);
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(['/']);
  }
}
