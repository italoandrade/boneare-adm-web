import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {ApiService} from '../../../utils/api.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-client-info',
  templateUrl: 'client-info.component.html',
  styleUrls: ['client-info.component.scss']
})

export class ClientInfoComponent implements OnInit {
  info: any = {};
  loading: boolean;

  constructor(public appComponent: AppComponent, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher, private apiService: ApiService, private router: Router, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.appComponent.title = 'Cliente';
    let infoFromTable: any = sessionStorage.getItem('info');
    try {
      infoFromTable = infoFromTable && JSON.parse(infoFromTable);
    } catch (e) {
    }
    const id = this.route.snapshot.params['id'];
    if (infoFromTable && +id === infoFromTable.id) {
      this.info = infoFromTable;
    }

    if (id) {
      this.apiService
        .prep('client', 'findById')
        .call({id})
        .subscribe(
          res => {
            this.info = res;
          },
          err => {
            this.router.navigate(['/client']);
            if (err.status === 404) {
              this.snackBar.open(err.error.message, null, {
                duration: 3000
              });
            }
            this.loading = false;
          }
        );
    }
  }

  onSubmit(form) {
    Object.keys(form.controls).forEach(i => {
      const input = form.controls[i];
      input.markAsTouched();
      if (input.invalid) {
        setTimeout(() => {
          (document.querySelector(`form input[name="${i}"]`) as HTMLElement).focus();
        });
      }
    });

    this.loading = true;
    if (form.invalid) {
      return this.loading = false;
    }

    if (!this.info.id) {
      this.apiService
        .prep('client', 'add')
        .call(this.info)
        .subscribe(
          res => {
            this.router.navigate(['/client/', res.id]);
            this.snackBar.open('Cliente adicionado', null, {
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
        .prep('client', 'update')
        .call(this.info)
        .subscribe(
          () => {
            this.router.navigate(['/client']);
            this.snackBar.open('Cliente atualizado', null, {
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
      .prep('client', 'remove')
      .call(this.info)
      .subscribe(
        () => {
          this.router.navigate(['/client']);
          this.snackBar.open('Cliente excluído', null, {
            duration: 3000
          });
        },
        err => {
          this.loading = false;
          console.error(err);
        }
      );
  }
}
