import {DataSource} from '@angular/cdk/table';
import {BehaviorSubject, of} from 'rxjs';
import {ClientListService} from './client-list.service';
import {CollectionViewer} from '@angular/cdk/collections';
import {catchError, finalize} from 'rxjs/operators';

export class ClientListDataSource implements DataSource<any> {

  public lessonsSubject = new BehaviorSubject<any>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();

  constructor(private coursesService: ClientListService) {
  }

  connect(collectionViewer: CollectionViewer) {
    return this.lessonsSubject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.lessonsSubject.complete();
    this.loadingSubject.complete();
  }

  loadLessons(courseId, filter, sortColumn, sortDirection, pageIndex = 0, pageSize = 10) {
    this.loadingSubject.next(true);

    this.coursesService
      .findLessons(courseId, filter, sortColumn, sortDirection, pageIndex, pageSize)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe(lessons => this.lessonsSubject.next(lessons));
  }
}
