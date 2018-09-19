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
  totalLinesCount = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private appComponent: AppComponent, private clientListService: ClientListService) {
  }

  ngOnInit() {
    this.appComponent.title = 'Cliente';
    this.dataSource = new ClientListDataSource(this.clientListService);
    this.dataSource.load(undefined, undefined, undefined, undefined, undefined);
    this.dataSource.subject.subscribe(items => {
      if (items) {
        this.totalLinesCount = items.length && (items[0].lineCount || 0);
      } else {
        this.totalLinesCount = null;
      }
    });
  }

  ngAfterViewInit() {
    fromEvent(this.input.nativeElement, 'keyup')
      .pipe(
        debounceTime(150),
        distinctUntilChanged(),
        tap(() => {
          this.paginator.pageIndex = 0;
          this.loadPage();
        })
      )
      .subscribe();

    this.sort.sortChange.subscribe(() => this.paginator.pageIndex = 0);

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => this.loadPage())
      )
      .subscribe();
  }

  loadPage() {
    this.dataSource.load(
      this.input.nativeElement.value ? this.input.nativeElement.value : undefined,
      this.sort.direction ? this.sort.active : undefined,
      this.sort.direction ? this.sort.direction : undefined,
      this.paginator.pageIndex,
      this.paginator.pageSize);
  }

  onRowClicked(row) {
    sessionStorage.setItem('info', JSON.stringify(row));
  }
}
