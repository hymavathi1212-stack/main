import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { Subject, distinctUntilChanged, debounceTime, BehaviorSubject, Observable, startWith, map, switchMap, catchError, of } from 'rxjs';
import { GlobalApiService } from 'app/global-api.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations     : fuseAnimations
})
export class TransactionsComponent {
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;
  selectedProduct: any | null = null;
  isLoading: boolean = false;
  pagination: any = {
    size: 20,
    page: 0
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public productsList: any = [];
  private searchSubject = new BehaviorSubject<string>('');
  selectedStatus: string = '';
  sortParams: Sort;
  profileTypes: Array<any> = [];
  public transactionDetailsMessage: string = '';
  /**
     * Constructor
     */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _globalApiService: GlobalApiService,
    public _dialog: MatDialog
  )
  {
    this.searchSubject.pipe(
        debounceTime(300), // Adjust debounce time as needed (in milliseconds)
        distinctUntilChanged()
    ).subscribe(() => {
        this.getProductsList();
    });
  }

  ngOnInit(): void {
    this.getProductsList();
  }

  ngAfterViewInit(): void {
    if ( this._sort && this._paginator )
    {
        // Set the initial sort
        this._sort.sort({
            id          : 'name',
            start       : 'asc',
            disableClear: true
        });

        // Mark for check
        this._changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next(null);
    this._unsubscribeAll.complete();
  }

  sortData(e: Sort) {
    this.sortParams = e;
    this.getProductsList();
  }
  /**
     * Toggle product details
     *
     * @param id
     */
  toggleDetails(id: string): void
  {
      // If the product is already selected...
      if ( this.selectedProduct && this.selectedProduct.id === id )
      {
          // Close the details
          this.closeDetails();
          return;
      }

      this.selectedProduct = this.productsList.find(item => item.id === id);
      this._changeDetectorRef.markForCheck();

  }

  /**
   * Close the details
   */
  closeDetails(): void
  {
      this.selectedProduct = null;
  }

  handlePageChange(e: PageEvent): void
  {
    this.pagination = {...this.pagination,...{
      size: e.pageSize,
      page: e.pageIndex
    }};
    this.getProductsList();
  }

  filterByCategory(e) {
    this.selectedStatus = e.value;
    this.getProductsList();
  }

  filterByQuery(e) {
    this.searchSubject.next(e);
  }

  getProductsList(): void {
    this.isLoading = true;
    const params = {
      apiName: 'transactions_list',
      queryParams: `?limit=${this.pagination.size}&pageNumber=${this.pagination.page}&keyword=${this.searchSubject.value || ''}&filterBy=${this.selectedStatus}&sortKey=${this.sortParams?.active || ''}&sortDir=${this.sortParams?.direction || ''}`
    };
    this._globalApiService.get(params).subscribe(response => {
      this.productsList = response?.data;
      this.pagination = {...this.pagination,...{
        length: response?.totalCount,
        page: response?.currentPage,
        lastPage: response?.lastPage
      }};
      this.transactionDetailsMessage = response?.message;
      this.isLoading = false;
      this._changeDetectorRef.markForCheck();
    }, err => {
      console.log(err);
    })
  }
}
