import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {ActivatedRoute, Router} from '@angular/router';
import {MediaMatcher} from '@angular/cdk/layout';
import {ApiService} from '../../../core/services/api.service';
import {MatSnackBar} from '@angular/material';
import {STATES} from './states';
import {elementClosest} from '../../../core/functions/closest.function';
import {CepService} from '../../../core/services/cep.service';

@Component({
  selector: 'app-client-info',
  templateUrl: 'client-info.component.html',
  styleUrls: ['client-info.component.scss']
})

export class ClientInfoComponent implements OnInit {
  info: any;
  loading = true;
  states = STATES;
  expansionFourValid = true;

  constructor(public appComponent: AppComponent, private route: ActivatedRoute, private changeDetectorRef: ChangeDetectorRef,
              private media: MediaMatcher, private apiService: ApiService, private router: Router, private snackBar: MatSnackBar,
              public cepService: CepService) {
    this.info = {
      address: {},
      phones: [],
      emails: []
    };
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
      this.info = {...this.info, ...infoFromTable};
    }

    if (id) {
      this.apiService
        .prep('client', 'findById')
        .call({id})
        .subscribe(
          res => {
            this.info = {...this.info, ...res};
          },
          err => {
            this.router.navigate(['/client']);
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
        .prep('client', 'add')
        .call(this.info)
        .subscribe(
          res => {
            this.router.navigate(['/client/', res.returning.id]);
            this.snackBar.open(res.message, null, {
              duration: 3000
            });
          },
          err => {
            this.loading = false;
            this.snackBar.open(err.error.message, null, {
              duration: 3000
            });
          }
        );
    } else {
      this.apiService
        .prep('client', 'update')
        .call(this.info)
        .subscribe(
          res => {
            this.router.navigate(['/client']);
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
      .prep('client', 'remove')
      .call(this.info)
      .subscribe(
        res => {
          this.router.navigate(['/client']);
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

  searchCep(zipCode, numberFieldEl, zipCodeFieldEl) {
    this.cepService.searchCep(zipCode, numberFieldEl, zipCodeFieldEl).subscribe(address => address ? this.info.address = address : null);
  }

  checkExpansionFourValid(expansion) {
    this.expansionFourValid = !expansion._body.nativeElement.querySelector('.ng-invalid');
  }
}

