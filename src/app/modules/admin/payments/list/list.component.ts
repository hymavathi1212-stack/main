import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { Subject, distinctUntilChanged, debounceTime, BehaviorSubject, Observable, startWith, map, switchMap, catchError, of } from 'rxjs';
import { GlobalApiService } from 'app/global-api.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup, NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { DateTime } from 'luxon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExportOptionsComponent } from 'app/shared/export/export-options/export-options.component';

import { FuseConfirmationService } from '@fuse/services/confirmation';
import { AngularCsv }from 'angular-csv-ext/dist/Angular-csv';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations     : fuseAnimations
})
export class ListComponent {
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
  selectedStatus: string = 'pending';
  sortParams: Sort;
  profileTypes: Array<any> = [];
  public transactionDetailsMessage: string = '';
  public pageSizeOptions = [10, 20, 50];
  public pageSizeOptionsClone = [];
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
  public startDate: any;
  public endDate: any;
  /**
     * Constructor
     */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _globalApiService: GlobalApiService,
    public _dialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService
  )
  {
    this.pageSizeOptionsClone = [...this.pageSizeOptions];
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

  resetDates() {
    this.range.reset();
    this.startDate = null;
    this.endDate = null;
    this.getProductsList();
  }

  dateRangeChanged() {
    if (this.range.value.start && this.range.value.end) {
      this.startDate = DateTime.fromISO(this.range.value.start as any).toFormat('yyyy-MM-dd');
      this.endDate = DateTime.fromISO(this.range.value.end as any).toFormat('yyyy-MM-dd');
      console.log(this.range.valid, this.range, this.startDate, this.endDate);
      this.getProductsList();
    } else {
      console.log('reset')
    }
  }

  filterByQuery(e) {
    this.searchSubject.next(e);
  }

  getProductsList(): void {
    this.isLoading = true;
    const params = {
      apiName: 'admin_transactions_list',
      queryParams: `?limit=${this.pagination.size}&pageNumber=${this.pagination.page}&keyword=${this.searchSubject.value || ''}&filterBy=${this.selectedStatus}&startDate=${this.startDate || ''}&endDate=${this.endDate || ''}&sortKey=${this.sortParams?.active || ''}&sortDir=${this.sortParams?.direction || ''}`
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
      if (this.selectedStatus === 'pending') {
        if (!this.pageSizeOptions.includes(response?.totalCount)) {
          const pageSizeOptions = this.pageSizeOptionsClone;
          pageSizeOptions.push(response?.totalCount);
          this.pageSizeOptions = [...pageSizeOptions];
        } else {
          this.pageSizeOptions = this.pageSizeOptionsClone;
        }
      }
      this._changeDetectorRef.markForCheck();
    }, err => {
      console.log(err);
    })
  }

  showConfirmAlert() {
    const warnIconData = {
        show : true,
        name : 'heroicons_outline:exclamation',
        color: 'warn'
    } as any;
    const successIconData = {
      show : true,
      name : 'heroicons_outline:download',
      color: 'success'
    } as any;
    const validProfiles = this.productsList.filter(item => item.profileVerified === 1);
    const dialogRef = this._fuseConfirmationService.open({
      title: 'Export Confirmation: (Only Profile Verified Records will get exported)',
      message: `${validProfiles?.length} records will get exported. ${(this.pagination.length > validProfiles?.length) ? 'Few more records were missing try to choose higher value in items per page option' : ''}`,
      icon: (this.pagination.length > validProfiles?.length) ? warnIconData : successIconData,
      actions: {
        confirm: {
          show: true,
          color: `${(this.pagination.length > this.productsList.length) ? 'warn' : 'primary'}`
        },
        cancel: {
          show: true
        }
      },
      dismissible: false
    });
    // Subscribe to afterClosed from the dialog reference
    dialogRef.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
          this.exportData();
        }
    });
  }

  exportData() {
    let csvOptions = { 
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalseparator: '.',
      headers: ["orderRef", "name", "mobile", "email", "accountNumber", "accountType", "ifsc", "amount"],
      useHeader: true,
      nullToEmptyString: true,
    };  
    const exportableData = this.productsList.map(item => {
      if (item.profileVerified === 1) {
        return {
          'orderRef': `${item.id}_${item.affiliateId}_${item.affiliateUserName}`,
          'name': item.accountName,
          'mobile': item.affiliateMobile,
          'email': item.affiliateEmail,
          'accountNumber': item.accountNumber,
          'accountType': item.accountType,
          'ifsc': item.ifsc,
          'amount': item.finalCommissionAmount
        }
      }
    });
    new AngularCsv(exportableData, `pending_payments_report_${DateTime.now().toFormat('yyyy-MM-dd_hh:mm:ss')}`, csvOptions);
  }

  exportPopUp() {
    const singleRecord = this.productsList?.[0];
    const columns = [];
    Object.keys(singleRecord).map(item => {
      columns.push({
        name: item,
        value: item,
        choose: false
      });
    });
    const dialogRef = this._dialog.open(ExportOptionsComponent, {
      minWidth: '40vw',
      disableClose: true,
      data: {
        columns: columns,
        selectedProduct: this.selectedProduct
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}