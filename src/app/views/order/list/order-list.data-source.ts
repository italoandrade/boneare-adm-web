import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, of} from 'rxjs';
import {OrderListService} from './order-list.service';
import {CollectionViewer} from '@angular/cdk/collections';
import {catchError, finalize} from 'rxjs/operators';

export class OrderListDataSource implements DataSource<any> {

  public subject = new BehaviorSubject<any>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$;

  constructor(private listService: OrderListService) {
    this.loading$ = this.loadingSubject.asObservable();
  }

  connect(collectionViewer: CollectionViewer) {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
    this.loadingSubject.complete();
  }

  load(filter?, sortColumn?, sortDirection?, pageIndex?, pageSize?) {
    this.loadingSubject.next(true);

    const listAll = this.listService.listAll(filter, sortColumn, sortDirection, pageIndex, pageSize);
    if (listAll.pipe) {
      listAll
        .pipe(
          catchError(() => of(null)),
          finalize(() => this.loadingSubject.next(false))
        )
        .subscribe(lessons => this.subject.next(lessons));
    } else {
      this.loadingSubject.next(false);
      this.subject.next(null);
    }
  }
}
