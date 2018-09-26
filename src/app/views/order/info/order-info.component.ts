import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {ApiService} from '../../../core/services/api.service';
import {MatAutocomplete, MatAutocompleteTrigger, MatSnackBar} from '@angular/material';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, takeUntil} from 'rxjs/operators';

@Component({
  selector: 'app-order-info',
  templateUrl: 'order-info.component.html',
  styleUrls: ['order-info.component.scss']
})

export class OrderInfoComponent implements OnInit {
  info: any;
  loading: boolean;

  @ViewChild(MatAutocomplete) autocompleteRef: MatAutocomplete;
  @ViewChild(MatAutocompleteTrigger) autocompleteTrigger: MatAutocompleteTrigger;

  clients;
  private clientSearchSubject = new Subject<string>();
  clientsSearchText;
  clientSelected;

  constructor(public appComponent: AppComponent, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher, private apiService: ApiService, private router: Router, private snackBar: MatSnackBar) {
    this.info = {
      transactions: []
    };
    this.clients = [];
  }

  ngOnInit() {
    this.appComponent.title = 'Pedido';
    let infoFromTable: any = sessionStorage.getItem('info');
    try {
      infoFromTable = infoFromTable && JSON.parse(infoFromTable);
    } catch (e) {
    }
    const id = this.route.snapshot.params['id'];
    if (infoFromTable && +id === infoFromTable.id) {
      this.info = {...this.info, ...infoFromTable};
    }

    this.getClientsAutocomplete();

    if (id) {
      this.loading = true;
      this.apiService
        .prep('order', 'findById')
        .call({id})
        .subscribe(
          res => {
            this.info = {...this.info, ...res};
          },
          err => {
            // noinspection JSIgnoredPromiseFromCall
            this.router.navigate(['/order']);
            if (err.status === 404) {
              this.snackBar.open(err.error.message, null, {
                duration: 3000
              });
            }
          },
          () => {
            this.loading = false;
          }
        );
    }

    this.clientSearchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(filter => {
        this.clientsSearchText = filter;
        this.clients = [];
        this.getClientsAutocomplete();
      });
  }

  onSubmit(form) {
    Object.keys(form.controls).forEach(i => {
      const input = form.controls[i];
      input.markAsTouched();
      if (input.invalid) {
        const inputElement = (document.querySelector(`form input[name="${i}"]`) as HTMLElement);
        inputElement.focus();
      }
    });

    this.loading = true;
    if (form.invalid) {
      return this.loading = false;
    }

    if (!this.info.id) {
      this.apiService
        .prep('order', 'add')
        .call(this.info)
        .subscribe(
          res => {
            // noinspection JSIgnoredPromiseFromCall
            this.router.navigate(['/order/', res.id]);
            this.snackBar.open(res.message, null, {
              duration: 3000
            });
          },
          err => {
            this.loading = false;
            console.error(err);
          }
        );
    } else {
      this.apiService
        .prep('order', 'update')
        .call(this.info)
        .subscribe(
          res => {
            // noinspection JSIgnoredPromiseFromCall
            this.router.navigate(['/order']);
            this.snackBar.open(res.message, null, {
              duration: 3000
            });
          },
          err => {
            console.error(err);
          },
          () => {
            this.loading = false;
          }
        );
    }
  }

  remove() {
    this.loading = true;
    this.apiService
      .prep('order', 'remove')
      .call(this.info)
      .subscribe(
        res => {
          // noinspection JSIgnoredPromiseFromCall
          this.router.navigate(['/order']);
          this.snackBar.open(res.message, null, {
            duration: 3000
          });
        },
        err => {
          this.loading = false;
          console.error(err);
        }
      );
  }

  getClientsAutocomplete() {
    if (!this.clients.loading && !this.clients.ended) {
      this.clients.loading = true;
      this.apiService
        .prep('client', 'findAutocomplete')
        .call({
          filter: this.clientsSearchText,
          unless: this.clients.map(x => x.id)
        })
        .subscribe(
          res => {
            const selected = this.clients.selected;
            this.clients = [...this.clients, ...res];
            this.clients.selected = selected;
            if (!res.length) {
              this.clients.ended = true;
            }
          },
          null,
          () => {
            this.clients.loading = false;
          }
        );
    }
  }

  clientAutocompleteFilter(filter) {
    this.clientSearchSubject.next(filter);
  }

  clientDisplayFn = (client) => {
    this.info.client = client ? client.id : undefined;
    return client ? client.name : undefined;
  };

  subPanelScroll() {
    setTimeout(() => {
      if (this.autocompleteRef && this.autocompleteTrigger && this.autocompleteRef.panel) {
        fromEvent(this.autocompleteRef.panel.nativeElement, 'scroll').pipe(
          map(x => this.autocompleteRef.panel.nativeElement),
          takeUntil(this.autocompleteTrigger.panelClosingActions)
        )
          .subscribe(x => {
            if (x.scrollTop + x.clientHeight === x.scrollHeight) {
              this.getClientsAutocomplete();
            }
          });
      }
    });
  }
}

