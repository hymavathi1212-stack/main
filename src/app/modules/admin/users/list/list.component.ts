import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable, Subject, distinctUntilChanged, debounceTime, BehaviorSubject } from 'rxjs';
import { GlobalApiService } from 'app/global-api.service';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { LocationStrategy } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  encapsulation  : ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations     : fuseAnimations
})
export class ListComponent implements OnInit, AfterViewInit, OnDestroy {
  
  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

  selectedUser: any | null = null;
  isLoading: boolean = false;
  pagination: any = {
    size: 20,
    page: 0
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public usersList: any = [];
  private searchSubject = new BehaviorSubject<string>('');
  selectedStatus: string = '';
  sortParams: Sort;
  affiliateTypeId: string = null;
  currentProfileStatus: any = null;
  profileTypes: Array<any> = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  rejectReason: string = '';
  reqPending: boolean = false;
  /**
     * Constructor
     */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseConfirmationService: FuseConfirmationService,
    private _formBuilder: UntypedFormBuilder,
    private _snackBar: MatSnackBar,
    private _globalApiService: GlobalApiService,
    private _location: LocationStrategy,
    public _dialog: MatDialog
  )
  {
    this.searchSubject.pipe(
        debounceTime(300), // Adjust debounce time as needed (in milliseconds)
        distinctUntilChanged()
    ).subscribe(() => {
        this.getUsersList();
    });
  }

  ngOnInit(): void {
    const data: any = this._location.getState();
    if (data && data.type) {
      this.selectedStatus = data.type?.toString();
    }
    this.getUsersList();
    this.fetchProfileTypes();
  }

  fetchProfileTypes(): void {
    const params = {
      apiName: 'fetch_profile_types'
    }
    this._globalApiService.get(params).subscribe((data) => {
      this.profileTypes = data;
    }, err => {
      
    });
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
    this.getUsersList();
  }
  /**
     * Toggle product details
     *
     * @param id
     */
  toggleDetails(id: string): void
  {
      // If the product is already selected...
      if ( this.selectedUser && this.selectedUser.id === id )
      {
          // Close the details
          this.closeDetails();
          return;
      }

      this.selectedUser = this.usersList.find(item => item.id === id);
      this.currentProfileStatus = this.selectedUser.profileVerified;
      this.affiliateTypeId = this.selectedUser.typeId;
      this._changeDetectorRef.markForCheck();

  }

  /**
   * Close the details
   */
  closeDetails(): void
  {
      this.selectedUser = null;
  }

  handlePageChange(e: PageEvent): void
  {
    this.pagination = {...this.pagination,...{
      size: e.pageSize,
      page: e.pageIndex
    }};
    this.getUsersList();
  }

  filterByCategory(e) {
    this.selectedStatus = e.value;
    this.getUsersList();
  }

  filterByQuery(e) {
    this.searchSubject.next(e);
  }

  getUsersList(): void {
    this.isLoading = true;
    const params = {
      apiName: 'users_list',
      queryParams: `?limit=${this.pagination.size}&pageNumber=${this.pagination.page}&keyword=${this.searchSubject.value || ''}&status=${this.selectedStatus}&sortKey=${this.sortParams?.active || ''}&sortDir=${this.sortParams?.direction || ''}`
    };
    this._globalApiService.get(params).subscribe(response => {
      this.usersList = response?.data;
      this.pagination = {...this.pagination,...{
        length: response?.totalCount,
        page: response?.currentPage,
        lastPage: response?.lastPage
      }};
      this.isLoading = false;
      this._changeDetectorRef.markForCheck();
    }, err => {
      console.log(err);
    })
  }

  getStatus(statusId): string {
    switch (statusId) {
      case 1:
        return 'approve';
      case 2:
        return 'unverified';
      case 3:
        return 'reject';
      case 4:
        return 'hold';
      default:
        return '';
    }
  }

  manageProfileApproval(disableDialog = false): void {
    if (this.reqPending) {
      return;
    }
    if (!disableDialog && (this.currentProfileStatus === 3 || this.currentProfileStatus === 4)) {
        this.openDialog();
        return;
    }
    const params = {
      apiName: 'manage_profile_approval',
      body: {
        userId: this.selectedUser.id,
        status: this.getStatus(this.currentProfileStatus),
        rejectReason: this.rejectReason
      }
    }
    this.reqPending = true;
    this._globalApiService.post(params).subscribe(data => {
      this._snackBar.open(data?.message, `Okay`, {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
      });
      this.rejectReason = '';
      this.getUsersList();
      this.toggleDetails(this.selectedUser.id);
      this.reqPending = false;
    }, err => {
      this.reqPending = false;
      this._snackBar.open(err?.error?.error || 'Oops ! Unable to process the request', `Okay`, {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
      });
    });
  }

  manageProfileTypeAction(): void {
    const params = {
      apiName: 'manage_profile_type_action',
      body: {
        userId: this.selectedUser.id,
        typeId: this.affiliateTypeId
      }
    };
    this._globalApiService.post(params).subscribe(data => {
      this._snackBar.open(data?.message, `Okay`, {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
      });
      this.getUsersList();
      this.toggleDetails(this.selectedUser.id);
    }, err => {
      this._snackBar.open(err?.error?.error || 'Oops ! Unable to process the request', `Okay`, {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
      });
    });
  }

  openDialog() {
    const dialogRef = this._dialog.open(ReasonPopUp, {
      disableClose: true,
      data: {
        profile: this.selectedUser
      }
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result?.reason) {
        this.rejectReason = result.reason;
        this.manageProfileApproval(true);
      }
    });
  }
  
}

@Component({
  selector: 'reason-popup',
  templateUrl: 'reason-popup.html',
  encapsulation: ViewEncapsulation.None
})
export class ReasonPopUp {
  
  @ViewChild('dialogContent') dialogContent: ElementRef;
  @ViewChild('reasonNgForm') reasonNgForm: NgForm;
  rejectReason: string = '';
  constructor(
    public _dialogRef: MatDialogRef<ReasonPopUp>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.rejectReason = this.data?.profile?.rejectReason;
  }

  saveReason() {
    this._dialogRef.close({
      reason: this.rejectReason
    });
  }

}