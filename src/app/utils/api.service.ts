import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ApiUnavailableDialog} from '../dialogs/api-unavailable.dialog';
import {MatDialog} from '@angular/material';

let API = {};

@Injectable()
export class ApiService {
  config;

  constructor(private http: HttpClient, public dialog: MatDialog) {
  }

  init(config) {
    this.config = config;

    let fnSuccess;
    let fnError;
    let fnRetry;

    this.http.get(config.apiUrl).subscribe(
      data => {
        API = data;
        if (fnSuccess) {
          fnSuccess();
        }
      },
      () => {
        if (fnError) {
          fnError();
        }

        const dialogRef = this.dialog.open(ApiUnavailableDialog, {
          width: '300px'
        });

        dialogRef.afterClosed().subscribe(() => {
          if (fnRetry) {
            fnRetry();
          }

          this.init(config).subscribe(fnSuccess, fnError, fnRetry);
        });
      }
    );


    return {
      subscribe: (success, error?, retry?) => {
        fnSuccess = success;
        fnError = error;
        fnRetry = retry;
      }
    };
  }

  prep(functionality, method) {
    const apiMethod = API[functionality][method];

    return {
      call: (data: {}, setHeaders?: {}) => {
        let url = this.config.apiHost + apiMethod.path;

        let headers = new HttpHeaders();
        if (!apiMethod.public) {
          headers = headers.set('Authentication', localStorage.getItem('RNB'));
        }
        if (setHeaders) {
          Object.keys(setHeaders).forEach((key) => {
            headers = headers.set(key, setHeaders[key]);
          });
        }

        let secondParam = data;
        let thirdParam = {
          headers
        };

        if (data) {
          const urlParams = jsonToParams(url, data);
          url = urlParams.url;
          data = urlParams.data;
        }

        if (method.method === 'get' || method.method === 'delete') {
          if (data) {
            url = url + jsonToQueryString(data);
          }
          secondParam = thirdParam;
          thirdParam = undefined;
        }

        const http = this.http[apiMethod.type](url, secondParam, thirdParam);

        return {
          subscribe: (pNext, pError?, pFinally?) => {
            return http.subscribe(pNext, (e) => {
              if (pError) {
                pError(e);
              }

              if (e.status === 0) {
                this.dialog.open(ApiUnavailableDialog, {
                  width: '300px'
                });
              }
            }).add(pFinally);
          }
        };
      }
    };
  }

}

function jsonToQueryString(json) {
  const params = Object.keys(json).map(function (key) {
    return encodeURIComponent(key) + '=' +
      encodeURIComponent(json[key]);
  });
  return (params.length ? '?' : '') + params.join('&');
}

function jsonToParams(url, data) {
  const dataClone = Object.assign({}, data);
  Object.keys(dataClone).forEach((key) => {
    if (url.includes(':' + key)) {
      url = url.replace(':' + key, dataClone[key]);
      delete dataClone[key];
    }
  });

  return {
    url: url,
    data: dataClone
  };
}
