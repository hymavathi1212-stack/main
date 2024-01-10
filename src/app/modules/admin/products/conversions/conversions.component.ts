import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { MatSort, Sort } from '@angular/material/sort';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import {
  Observable,
  Subject,
  distinctUntilChanged,
  debounceTime,
  BehaviorSubject,
} from 'rxjs';
import { GlobalApiService } from 'app/global-api.service';
@Component({
  selector: 'app-conversions',
  templateUrl: './conversions.component.html',
  styleUrls: ['./conversions.component.scss']
})
export class ConversionsComponent {

  @ViewChild(MatPaginator) private _paginator: MatPaginator;
  @ViewChild(MatSort) private _sort: MatSort;

    selectedUser: any | null = null;
    isLoading: boolean = false;
    pagination: any = {
        size: 20,
        page: 0,
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();
    public conversionsList: any = [];
    private searchSubject = new BehaviorSubject<string>('');
    selectedStatus: string = '';
    sortParams: Sort;
    public conversionDetails: any = {};
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _fuseConfirmationService: FuseConfirmationService,
        private _formBuilder: UntypedFormBuilder,
        private _globalApiService: GlobalApiService
    ) {
        this.searchSubject
            .pipe(
                debounceTime(300), // Adjust debounce time as needed (in milliseconds)
                distinctUntilChanged()
            )
            .subscribe(() => {
                this.getconversionsList();
            });
    }

    ngOnInit(): void {
        this.getconversionsList();
    }

    ngAfterViewInit(): void {
        if (this._sort && this._paginator) {
            // Set the initial sort
            this._sort.sort({
                id: 'name',
                start: 'asc',
                disableClear: true,
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
        this.getconversionsList();
    }
    /**
     * Toggle product details
     *
     * @param id
     */
    toggleDetails(id: string): void {
        // If the product is already selected...
        if (this.selectedUser && this.selectedUser.id === id) {
            // Close the details
            this.closeDetails();
            return;
        }
        this.getConversionDetails(id);
        this.selectedUser = this.conversionsList.find((item) => item.id === id);

        this._changeDetectorRef.markForCheck();
    }

    /**
     * Close the details
     */
    closeDetails(): void {
        this.selectedUser = null;
    }

    handlePageChange(e: PageEvent): void {
        this.pagination = {
            ...this.pagination,
            ...{
                size: e.pageSize,
                page: e.pageIndex,
            },
        };
        this.getconversionsList();
    }

    filterByCategory(e) {
        this.selectedStatus = e.value;
        this.getconversionsList();
    }

    filterByQuery(e) {
        this.searchSubject.next(e);
    }
    getConversionDetails(id: string) {
      const params = {
        apiName: 'get_conversion_details_by_id',
        body: {
          conversionId: parseInt(id)
        }
      };
      this._globalApiService.post(params).subscribe(data => {
        this.conversionDetails = data;
      }, err => {
        this.conversionDetails = {};
      });
    }
    getconversionsList(): void {
        this.isLoading = true;
        const params = {
            apiName: 'conversions_list',
            queryParams: `?limit=${this.pagination.size}&pageNumber=${
                this.pagination.page
            }&keyword=${this.searchSubject.value || ''}&status=${
                this.selectedStatus
            }&sortKey=${this.sortParams?.active || ''}&sortDir=${
                this.sortParams?.direction || ''
            }`,
        };
        this._globalApiService.get(params).subscribe(
            (response) => {
                this.conversionsList = response?.data;
                this.pagination = {
                    ...this.pagination,
                    ...{
                        length: response?.totalCount,
                        page: response?.currentPage,
                        lastPage: response?.lastPage,
                    },
                };
                this.isLoading = false;
                this._changeDetectorRef.markForCheck();
            },
            (err) => {
                console.log(err);
            }
        );
    }
}
