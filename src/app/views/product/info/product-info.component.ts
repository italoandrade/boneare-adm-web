import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {ApiService} from '../../../core/services/api.service';
import {MatSnackBar} from '@angular/material';
import {CustomSnackbarComponent} from '../../../core/components/custom-snackbar/custom-snackbar.component';

@Component({
  selector: 'app-product-info',
  templateUrl: 'product-info.component.html',
  styleUrls: ['product-info.component.scss']
})

export class ProductInfoComponent implements OnInit {
  info: any;
  loading = true;

  constructor(public appComponent: AppComponent, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher, private apiService: ApiService, private router: Router, private snackBar: MatSnackBar) {
    this.info = {};
  }

  ngOnInit() {
    this.appComponent.title = 'Produto';

    let infoFromTable: any = sessionStorage.getItem('info');
    try {
      infoFromTable = infoFromTable && JSON.parse(infoFromTable);
    } catch (e) {
    }
    const id = this.route.snapshot.params['id'];
    if (infoFromTable && +id === infoFromTable.id) {
      this.info = {...this.info, ...infoFromTable};
    }

    if (id) {
      this.apiService
        .prep('product', 'findById')
        .call({id})
        .subscribe(
          res => {
            this.info = {...this.info, ...res};
          },
          err => {
            this.router.navigate(['/product']);
            if (err.status === 404) {
              this.snackBar.open(err.error.message, null, {
                duration: 3000
              });
            }
          },
          () => this.loading = false
        );
    } else {
      this.loading = false;
    }
  }

  onSubmit(form) {
    this.loading = true;

    this.validateForm(form);
    if (form.invalid) {
      return this.loading = false;
    }

    if (!this.info.id) {
      this.apiService
        .prep('product', 'add')
        .call(this.info)
        .subscribe(
          res => {
            this.router.navigate(['/product/', res.id]);
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
        .prep('product', 'update')
        .call(this.info)
        .subscribe(
          res => {
            this.router.navigate(['/product']);
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
      .prep('product', 'remove')
      .call({
        id: this.info.id
      })
      .subscribe(
        res => {
          this.router.navigate(['/product']);
          this.snackBar.open(res.message, null, {
            duration: 3000
          });
        },
        err => {
          this.loading = false;
          if (err.status === 409) {
            let relations = err.error.relations.map(i => `<a href="${i.url}" target="_blank">${i.relation}</a>`).join(', ');
            this.snackBar.openFromComponent(CustomSnackbarComponent, {
              duration: 10000,
              data: `${err.error.message} com ${relations}`
            });
          } else {
            console.error(err);
          }
        }
      );
  }

  validateForm(form) {
    Object.keys(form.controls).forEach(i => {
      const input = form.controls[i];
      input.markAsTouched();
      if (input.invalid) {
        const inputElement = (document.querySelector(`form input[name="${i}"]`) as HTMLElement);
        inputElement.focus();
      }
    });
  }
}

