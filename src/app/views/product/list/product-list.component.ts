import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppComponent} from '../../../app.component';
import {MatPaginator, MatSort} from '@angular/material';
import {ProductListDataSource} from './product-list.data-source';
import {ProductListService} from './product-list.service';
import {debounceTime, distinctUntilChanged, tap} from 'rxjs/operators';
import {fromEvent, merge} from 'rxjs';

@Component({
  selector: 'app-product-list',
  templateUrl: 'product-list.component.html',
  styleUrls: ['product-list.component.scss']
})

export class ProductListComponent implements OnInit, AfterViewInit {
  displayedColumns = ['id', 'name'];
  dataSource: ProductListDataSource;
  totalLinesCount = null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;

  constructor(private appComponent: AppComponent, private listService: ProductListService) {
  }

  ngOnInit() {
    this.appComponent.title = 'Produtos';
    this.dataSource = new ProductListDataSource(this.listService);
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
