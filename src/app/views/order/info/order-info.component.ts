import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {ApiService} from '../../../core/services/api.service';
import {MatAutocomplete, MatAutocompleteTrigger, MatSnackBar} from '@angular/material';
import {fromEvent, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map, takeUntil} from 'rxjs/operators';
import {elementClosest} from '../../../core/functions/closest.function';

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
  clientsSearchText;
  clientSelected;
  products;
  productsSearchText;
  productSelected;
  newProduct;
  clientDisplayFn = (client) => {
    this.info.clientId = client ? client.id : undefined;
    return client ? client.name : undefined;
  };
  productDisplayFn = (product) => {
    this.newProduct.productId = product ? product.id : undefined;
    this.newProduct.name = product ? product.name : undefined;
    this.newProduct.price = product ? product.price : undefined;
    this.newProduct.weight = product ? product.weight : undefined;
    return product ? product.name : undefined;
  };
  transactionTypes;
  newTransaction;
  private clientSearchSubject = new Subject<string>();
  private productSearchSubject = new Subject<string>();

  constructor(public appComponent: AppComponent, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher, private apiService: ApiService, private router: Router, private snackBar: MatSnackBar) {
    this.transactionTypes = [
      {id: 1, name: 'Receita'},
      {id: 2, name: 'Despesa'}
    ];
    this.info = {
      transactions: [],
      products: []
    };
    this.clients = [];
    this.products = [];
    this.newProduct = {entry: false};
    this.newTransaction = {date: new Date()};
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
    this.getProductsAutocomplete();

    if (id) {
      this.loading = true;
      this.apiService
        .prep('order', 'findById')
        .call({id})
        .subscribe(
          res => {
            this.info = {...this.info, ...res};
            this.clientSelected = res.client;
          },
          err => {
            this.router.navigate(['/order']);
            if (err.status === 404) {
              this.snackBar.open(err.error.message, null, {
                duration: 3000
              });
            } else {
              this.snackBar.open('Não foi possível ver o pedido', null, {
                duration: 3000
              });
              console.error(err);
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

    this.productSearchSubject.pipe(
      debounceTime(400),
      distinctUntilChanged())
      .subscribe(filter => {
        this.productsSearchText = filter;
        this.products = [];
        this.getProductsAutocomplete();
      });
  }

  onSubmit(form) {
    this.validateForm(form);

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
            this.router.navigate(['/order/', res.return.id]);
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

  validateForm(form) {
    Object.keys(form.controls).forEach(i => {
      const input = form.controls[i];
      input.markAsTouched();
      if (input.invalid) {
        setTimeout(() => {
          const inputElement = (document.querySelector(`form input[name="${i}"]`) as HTMLElement);
          const expansionPanel = elementClosest(inputElement, 'mat-expansion-panel');
          if (expansionPanel && !expansionPanel.classList.contains('mat-expanded')) {
            expansionPanel.querySelector('mat-expansion-panel-header').click();
            setTimeout(() => {
              inputElement.focus();
            }, 200);
          } else {
            inputElement.focus();
          }
        });
      }
    });
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
            this.clients = [...this.clients, ...res];
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

  getProductsAutocomplete() {
    if (!this.products.loading && !this.products.ended) {
      this.products.loading = true;
      this.apiService
        .prep('product', 'findAutocomplete')
        .call({
          filter: this.productsSearchText,
          unless: [...this.products.map(x => x.id), ...this.info.products.map(x => x.id)]
        })
        .subscribe(
          res => {
            this.products = [...this.products, ...res];
            if (!res.length) {
              this.products.ended = true;
            }
          },
          error => {
            this.snackBar.open('Não foi possível carregar a lista de produtos', null, {
              duration: 3000
            });
            console.error(error);
          },
          () => {
            this.products.loading = false;
          }
        );
    }
  }

  productAutocompleteFilter(filter) {
    this.productSearchSubject.next(filter);
  }

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

  calcProductTotal(type) {
    const array = this.info.products;
    let total = 0;
    if (type === 'cost') {
      for (let i = 0, _len = array.length; i < _len; i++) {
        total += (array[i]['quantity'] * array[i]['price'] * (array[i]['entry'] ? 0 : 1));
      }
    } else {
      for (let i = 0, _len = array.length; i < _len; i++) {
        total += (array[i]['quantity'] * array[i]['weight'] * (array[i]['entry'] ? 1 : -1));
      }
    }
    return total;
  }

  calcTransactionTotal() {
    const array = this.info.transactions;
    let total = 0;
    for (let i = 0, _len = array.length; i < _len; i++) {
      total += (array[i]['amount'] * (array[i]['type']['id'] === 1 ? 1 : -1));
    }
    return total;
  }

  addNewProduct() {
    if (!this.newProduct.productId || !this.newProduct.quantity) {
      this.snackBar.open('Preencha todos os campos para adicionar um novo produto no pedido', null, {
        duration: 3000
      });
      return false;
    }
    this.info.products.push(this.newProduct);
    this.newProduct = {entry: false};
    this.productSelected = undefined;
  }

  addNewTransaction() {
    if (!this.newTransaction.type || !this.newTransaction.amount || !this.newTransaction.date) {
      this.snackBar.open('Preencha todos os campos para adicionar uma nova transação no pedido', null, {
        duration: 3000
      });
      return false;
    }
    this.info.transactions.push(this.newTransaction);
    this.newTransaction = {date: new Date()};
  }

  selectTransactionType($event) {
    console.log($event);
  }
}


