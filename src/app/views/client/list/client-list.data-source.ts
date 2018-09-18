import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, of} from 'rxjs';
import {ClientListService} from './client-list.service';
import {CollectionViewer} from '@angular/cdk/collections';
import {catchError, finalize} from 'rxjs/operators';

export class ClientListDataSource implements DataSource<any> {

  public subject = new BehaviorSubject<any>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private clientListService: ClientListService) {
  }

  connect(collectionViewer: CollectionViewer) {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
    this.loadingSubject.complete();
  }

  load(filter, sortColumn, sortDirection, pageIndex, pageSize) {
    this.loadingSubject.next(true);

    this.clientListService
      .listAll(filter, sortColumn, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of(null)),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(lessons => this.subject.next(lessons));
  }
}
