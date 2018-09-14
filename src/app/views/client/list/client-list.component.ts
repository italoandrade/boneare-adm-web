import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {MatPaginator, MatSort} from '@angular/material';
import {ClientListDataSource} from './client-list.data-source';
import {ClientListService} from './client-list.service';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {fromEvent, merge} from 'rxjs';

@Component({
  selector: 'app-client-list',
  templateUrl: 'client-list.component.html',
  styleUrls: ['client-list.component.scss']
})

export class ClientListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'name'];
  dataSource: ClientListDataSource;
  lessonsCount = 0;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private appComponent: AppComponent, private clientListService: ClientListService) {
  }

  ngOnInit() {
    this.appComponent.title = 'Clientes';
    this.dataSource = new ClientListDataSource(this.clientListService);
    this.dataSource.loadLessons(1, undefined, undefined, undefined, 0, 10);
    this.dataSource.lessonsSubject.subscribe((test) => {
      if (test.length) {
         this.lessonsCount = test[0].lineCount;
      }
    });
  }

  ngAfterViewInit() {
    // server-side search
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadLessonsPage();
        })
      )
      .subscribe();

    // reset the paginator after sorting
    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    // on sort or paginate events, load a new page
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadLessonsPage())
      )
      .subscribe();
  }

  loadLessonsPage() {
    this.dataSource.loadLessons(
      1,
      this.input.nativeElement.value ? this.input.nativeElement.value : undefined,
      this.sort.direction ? this.sort.active : undefined,
      this.sort.direction ? this.sort.direction : undefined,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  onRowClicked(row) {
    console.log('Row clicked: ', row);
  }
}
