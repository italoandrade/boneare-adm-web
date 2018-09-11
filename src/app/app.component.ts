import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {ApiService} from './utils/api.service';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;
  navOpened: boolean;
  @ViewChild('snav') snav;
  menu;
  title;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher, private apiService: ApiService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
    this.menu = [
      {title: 'Início', icon: 'home', url: '/'},
      {title: 'Iniciar sessão', icon: 'person', url: '/sign-in'},
    ];
    this.apiService.init({
      apiUrl: environment.apiHost + environment.apiRoutes
    });
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
}
