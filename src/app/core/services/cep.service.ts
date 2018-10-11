import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material';

@Injectable()
export class CepService {
  loadingCep;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {
  }

  searchCep(zipCode, numberFieldEl, cepFieldEl) {
    return new Observable((observer) => {
      if (zipCode) {
        this.loadingCep = true;
        this.http.get(`https://viacep.com.br/ws/${zipCode}/json/`).subscribe(
          (res: any) => {
            if (!res.erro) {
              observer.next({
                zipCode: zipCode,
                street: res.logradouro,
                complement: res.complemento,
                district: res.bairro,
                city: res.localidade,
                state: res.uf
              });
              numberFieldEl.focus();
            } else {
              this.snackBar.open('Endereço não encontrado', null, {
                duration: 3000
              });
            }
          }, () => {
            this.snackBar.open('Endereço não encontrado', null, {
              duration: 3000
            });
          }
        ).add(() => {
          observer.next(null);
          this.loadingCep = false;
        });
      } else {
        observer.next(null);
        cepFieldEl.focus();
      }
    });
  }
}
