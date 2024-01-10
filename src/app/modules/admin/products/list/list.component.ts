import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { Subject, distinctUntilChanged, debounceTime, BehaviorSubject, Observable, startWith, map, switchMap, catchError, of } from 'rxjs';
import { GlobalApiService } from 'app/global-api.service';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AbstractControl, FormControl, NgForm, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { HttpClient } from '@angular/common/http';
import { DateTime } from 'luxon';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { FuseConfirmationService } from '@fuse/services/confirmation';
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
  selectedProduct: any | null = null;
  isLoading: boolean = false;
  pagination: any = {
    size: 20,
    page: 0
  };
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public productsList: any = [];
  private searchSubject = new BehaviorSubject<string>('');
  selectedStatus: string = '2';
  sortParams: Sort;
  profileTypes: Array<any> = [];
  /**
     * Constructor
     */
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _globalApiService: GlobalApiService,
    public _dialog: MatDialog,
    private _fuseConfirmationService: FuseConfirmationService,
    private _snackBar: MatSnackBar,
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
    this.fetchProfileTypes();
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

  fetchProfileTypes(): void {
    const params = {
      apiName: 'fetch_profile_types'
    }
    this._globalApiService.get(params).subscribe((data) => {
      this.profileTypes = data;
    }, err => {
      console.log(err);
    });
  }

  getProductsList(): void {
    this.isLoading = true;
    const params = {
      apiName: 'products_list',
      queryParams: `?limit=${this.pagination.size}&pageNumber=${this.pagination.page}&keyword=${this.searchSubject.value || ''}&status=${this.selectedStatus}&sortKey=${this.sortParams?.active || ''}&sortDir=${this.sortParams?.direction || ''}`
    };
    this._globalApiService.get(params).subscribe(response => {
      this.productsList = response?.data;
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

  openDialog() {
    const dialogRef = this._dialog.open(UserWiseCommissionPopUp, {
      minWidth: '80vw',
      disableClose: true,
      data: {
        selectedProduct: this.selectedProduct
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  openProfileTypeCommissionPopup() {
    const dialogRef = this._dialog.open(TypeWiseCommissionPopUp, {
      minWidth: '50vw',
      disableClose: true,
      data: {
        selectedProduct: this.selectedProduct,
        profileTypes: this.profileTypes
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result?.refresh) {
        this.closeDetails();
        this.getProductsList();
      }
    });
  }

  showConfirmAlert(type) {
    const warnIconData = {
        show : true,
        name : 'heroicons_outline:exclamation',
        color: 'warn'
    } as any;
    const successIconData = {
      show : true,
      name : 'feather:eye',
      color: 'success'
    } as any;
    const dialogRef = this._fuseConfirmationService.open({
      title: `Are you sure to make product ${type} ?`,
      icon: type === 'in-active' ? warnIconData : successIconData,
      message: `${type === 'in-active' ? `Once this modification is made, the product won't be shown to affiliate's` : `Once this modification is made, the product will become visible to affiliates`}`,
      actions: {
        confirm: {
          show: true
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
          this.toggleStatus(type, true);
        }
    });
  }

  toggleStatus(status, ignoreAlert = false) {
    let actionName = '';
    if (status === 0) {
      actionName = 'active';
    }
    if (status === 1) {
      actionName = 'in-active';
    }
    if (!ignoreAlert) {
      this.showConfirmAlert(actionName);
    }
    else {
      const params = {
        apiName: 'manage_product',
        body: {
          productId: this.selectedProduct.id,
          action: status
        }
      };
      this._globalApiService.post(params).subscribe(response => {
        this.closeDetails();
        this.getProductsList();
        this._snackBar.open(response.message, `Okay`, {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000
        });
      }, err => {
        this._snackBar.open(err.error?.error || 'Failed to perform action', `Okay`, {
          horizontalPosition: 'end',
          verticalPosition: 'top',
          duration: 3000
        });
      });
    }
  }

  editProductDetails() {
    console.log(this.selectedProduct);
    const dialogRef = this._dialog.open(UpdateProductDetailsPopUp, {
      minWidth: '50vw',
      disableClose: true,
      data: {
        selectedProduct: this.selectedProduct
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result?.refresh) {
        this.closeDetails();
        this.getProductsList();
      }
    });
  }
  
}

@Component({
  selector: 'user-wise-commission-popup',
  templateUrl: 'user-wise-commission-popup.html',
  encapsulation: ViewEncapsulation.None
})
export class UserWiseCommissionPopUp implements OnInit {
  @ViewChild('dialogContent') dialogContent: ElementRef;
  @ViewChild('commissionNgForm') commissionNgForm: NgForm;
  commissionForm: UntypedFormGroup;
  public itemsList: any = Array(100);
  userSearchCtrl = new FormControl('');
  filteredStates: Observable<any[]>;
  selectedUser: any = null;
  public searchResults: Array<any> = [];
  public productCommissionUsersList: Array<any> = [];
  minDate = DateTime.now();
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _formBuilder: UntypedFormBuilder,
    private _globalApiService: GlobalApiService,
    private _http: HttpClient,
    private _snackBar: MatSnackBar,
  ) {
    this.userSearchCtrl.valueChanges.pipe(
      debounceTime(300), // Adjust the debounce time as needed
      distinctUntilChanged(),
      switchMap((searchTerm: string) => this.searchAPI(searchTerm).pipe(
        catchError(() => of([])) // Handle error and continue stream with empty array
      ))
    ).subscribe((results: any[]) => {
      this.searchResults = results;
    });
  }
  
  ngOnInit(): void {
    console.log(this.data);
    this.commissionForm = this._formBuilder.group({
        id: [''],
        name  : ['', Validators.required],
        email : ['', Validators.required],
        commission: ['', [Validators.required, Validators.min(1), Validators.max(99)]],
        endDate: ['']
    });
    this.userSearchCtrl.setValue('');
    this.getProductUserCommissionList();
  }

  saveDetails() {
    this.commissionForm.disable();
    const params = {
      apiName: 'update_user_commission_details',
      body: {
        productId: this.data.selectedProduct.id,
        userId: this.commissionForm.value.id,
        commission: parseFloat(this.commissionForm.value.commission),
        endDate: this.commissionForm.value.endDate ? DateTime.fromISO(this.commissionForm.value.endDate).toFormat('yyyy-MM-dd') : null
      }
    }
    this._globalApiService.post(params).subscribe(data => {
      this.getProductUserCommissionList();
      this.commissionForm.enable();
      this.resetForm();
      this._snackBar.open(data?.message, `Okay`, {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
    }, err => {
      this.commissionForm.enable();
      this._snackBar.open(err?.error?.error || 'Unable to process your request', `Okay`, {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
    });
  }

  searchAPI(searchTerm: string) {
    const params = {
      apiName: 'search_user',
      body: {
        keyword: searchTerm,
        productId: this.data.selectedProduct.id
      }
    }
    const apiUrl = `${this._globalApiService.prepareApiUrl(params)}`;
    return this._http.post(apiUrl, params.body);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent) {
    const selectedOption = event.option.value;
    this.selectedUser = this.searchResults.find(item => item.email === selectedOption);
    this.setFormValues();
  }

  resetForm() {
    this.commissionNgForm.resetForm();
    this.selectedUser = null;
    this.userSearchCtrl.reset();
  }

  editDetails(user) {
    this.selectedUser = user;
    this.setFormValues();
    this.scrollToTop();
  }

  setFormValues() {
    this.commissionForm.get('name').disable();
    this.commissionForm.get('email').disable();
    this.commissionForm.patchValue({
      id: this.selectedUser?.id,
      name: this.selectedUser?.name,
      email: this.selectedUser?.email,
      commission: this.selectedUser?.commissionRate,
      endDate: this.selectedUser?.endDate
    });
  }

  removeCommission(user) {
    const params = {
      apiName: 'remove_user_commission',
      body: {
        affiliateProductUserCommissionId: user.affiliateProductUserCommissionId,
        userId: user.id
      }
    };
    this._globalApiService.post(params).subscribe(data => {
      this.getProductUserCommissionList();
      this._snackBar.open(data?.message, `Okay`, {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
    }, err => {
      this._snackBar.open(err?.error?.error || 'Unable to process your request', `Okay`, {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
      });
    });
  }

  scrollToTop() {
    this.dialogContent.nativeElement.scrollTop = 0;
  }

  getProductUserCommissionList(): void {
    const params = {
      apiName: 'get_user_commission_list',
      body: {
        productId: this.data.selectedProduct.id
      }
    };
    this._globalApiService.post(params).subscribe(data => {
      this.productCommissionUsersList = data;
    }, err => {
      this.productCommissionUsersList = [];
      console.log(err);
    });
  }

}

@Component({
  selector: 'profile-type-wise-commission-popup',
  templateUrl: 'update-commission-popup.html',
  encapsulation: ViewEncapsulation.None
})
export class TypeWiseCommissionPopUp implements OnInit {
  @ViewChild('dialogContent') dialogContent: ElementRef;
  @ViewChild('commissionNgForm') commissionNgForm: NgForm;
  profileTypeModel: any = {};
  profileTypes: any = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  reqProcessing: boolean = false;
  constructor(
    public _dialogRef: MatDialogRef<TypeWiseCommissionPopUp>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _globalApiService: GlobalApiService,
    private _snackBar: MatSnackBar,
  ) {
  }
  ngOnInit(): void {
    this.profileTypes = this.data?.profileTypes;
    this.profileTypes.map(item => {
      const foundItem = this.data?.selectedProduct?.commissionDetails.find(commission => commission?.profileTypeId?.id === item.id);
      this.profileTypeModel[item.id] = foundItem?.commissionRate || null;
    });
  }

  saveCommission() {
    if (this.commissionNgForm.form.status === 'VALID') {
      this.reqProcessing = true;
      const commission = [];
      for (let eachItem in this.profileTypeModel) {
        commission.push({
          id: parseInt(eachItem),
          commissionRate: parseFloat(this.profileTypeModel[eachItem])
        });
      }
      const params = {
        apiName: 'update_profile_type_wise_commission',
        body: {
          productId: this.data.selectedProduct?.id,
          commission: commission
        }
      }
      this._globalApiService.post(params).subscribe(data => {
        this._snackBar.open(data?.message, `Okay`, {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
        this.reqProcessing = false;
        this._dialogRef.close({
          refresh: true
        });
      }, err => {
        this._snackBar.open(err?.error?.error || 'Unable to process your request', `Okay`, {
          horizontalPosition: this.horizontalPosition,
          verticalPosition: this.verticalPosition,
          duration: 3000
        });
        this.reqProcessing = false;
      });
    }
  }

}

@Component({
  selector: 'update-product-details-popup',
  templateUrl: 'update-product-details-popup.html',
  encapsulation: ViewEncapsulation.None
})
export class UpdateProductDetailsPopUp implements OnInit {
  @ViewChild('dialogContent') dialogContent: ElementRef;
  @ViewChild('updateNgForm') updateNgForm: NgForm;
  reqProcessing: boolean = false;
  createProductForm: UntypedFormGroup;
  minDate = DateTime.now().plus({ days: 1});
  constructor(
    private _formBuilder: UntypedFormBuilder,
    public _dialogRef: MatDialogRef<TypeWiseCommissionPopUp>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _globalApiService: GlobalApiService,
    private _snackBar: MatSnackBar,
  ) {
  }
  ngOnInit(): void {
    this.createProductForm = this._formBuilder.group({
      productId: [this.data?.selectedProduct?.id],
      productTitle    : [this.data?.selectedProduct?.productTitle, [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      productDescription  : [this.data?.selectedProduct?.productDescription, [Validators.minLength(5), Validators.maxLength(1000)]],
      price : [this.data?.selectedProduct?.price, [Validators.required, Validators.minLength(1), Validators.maxLength(10), Validators.pattern(/^\d+(\.\d+)?$/)]],
      offerPrice  : [this.data?.selectedProduct?.offerPrice, [Validators.minLength(1), Validators.maxLength(10), Validators.pattern(/^\d+(\.\d+)?$/), offerPriceValidator]],
      image: [this.data?.selectedProduct?.image, [Validators.pattern(/^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/i)]],
      productUrl:[{ value: this.data?.selectedProduct?.productUrl, disabled: true }, [Validators.required, Validators.pattern(/^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,})(\/\S*)?$/)]],
      expiryDate     : [this.data?.selectedProduct?.expiryDate]
    });
  }

  updateDetails() {
    this.reqProcessing = true;
    const productParams = this.createProductForm.value;
    if (productParams?.expiryDate) {
      productParams['expiryDate'] = DateTime.fromISO(productParams?.expiryDate).toFormat('yyyy-MM-dd');
    }
    const params = {
      apiName: 'update_product',
      body: {
        productId: productParams?.productId,
        productTitle: productParams?.productTitle,
        productDescription: productParams?.productDescription,
        price: parseFloat(productParams?.price),
        offerPrice: productParams?.offerPrice ? parseFloat(productParams?.offerPrice) : 0,
        image: productParams?.image,
        expiryDate: productParams?.expiryDate || null
      }
    };
    this._globalApiService.post(params).subscribe((data) => {
      this._snackBar.open(data?.message || 'Product has been updated successfully !', `Okay`, {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000
      });
      this.reqProcessing = false;
      this._dialogRef.close({
        refresh: true
      });
    }, err => {
      let errorMessage = '';
      if (err.error?.length > 0) {
        err.error.map(item => {
          errorMessage += `${item?.instancePath.replace('/', '')} ${item?.message} </br>`
        });
      }
      this._snackBar.open(err.error?.error || (errorMessage || 'Something went wrong !'), `Okay`, {
        horizontalPosition: 'end',
        verticalPosition: 'top',
        duration: 3000
      });
      this.reqProcessing = false;
    });
  }

}

function offerPriceValidator(control: AbstractControl): ValidationErrors | null {
  const priceControl = control.root?.get('price');
  if (priceControl && !priceControl.value) {
    return { priceValueRequired: true };
  }
  if (priceControl && parseFloat(control.value) >= parseFloat(priceControl.value)) {
    return { offerPriceExceeded: true }; // Return an error object if offerPrice is more than price
  }
  return null; // Return null if validation passes
}