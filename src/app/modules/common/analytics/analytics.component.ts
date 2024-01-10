import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { GlobalApiService } from 'app/global-api.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent implements OnInit {
  public products: any = [];
  public activeProduct: any = {};
  public searchKey: string = '';
  public productsClone: any = [];
  public categories: any = [
    {
      title: 'Active',
      slug: 'active'
    },
    {
      title: 'Expired',
      slug: 'expired'
    }
  ];
  drawerMode: 'over' | 'side' = 'side';
  drawerOpened: boolean = true;
  public userTrackList: any = {
    columns: ["name", "email", "mobile", "paymentStatus", "affiliateStatus", "createdAt"],
    rows: []
  }
  public analytics: any = null;
  private _unsubscribeAll: Subject<any> = new Subject<any>();
  public activeProductId: number;
  constructor(
    private _changeDetectorRef: ChangeDetectorRef,
    private _fuseMediaWatcherService: FuseMediaWatcherService,
    private _globalApiService: GlobalApiService,
    private _route: ActivatedRoute
  ) {

  }
  ngOnInit(): void {
    this.fetchProducts('active');
    this._route.queryParams.subscribe(params => {
      const data = params['product'];
      if (data) {
        this.activeProductId = parseInt(data);
      }
    });
    this._fuseMediaWatcherService.onMediaChange$
    .pipe(takeUntil(this._unsubscribeAll))
    .subscribe(({matchingAliases}) => {

        // Set the drawerMode and drawerOpened if 'lg' breakpoint is active
        if ( matchingAliases.includes('lg') )
        {
            this.drawerMode = 'side';
            this.drawerOpened = true;
        }
        else
        {
            this.drawerMode = 'over';
            this.drawerOpened = false;
        }

        // Mark for check
        this._changeDetectorRef.markForCheck();
    });
  }

  fetchProducts(filterCategory) {
    const params = {
      apiName: 'fetch_affiliate_products_with_filter',
      queryParams: `?filterBy=${filterCategory}`
    };
    this._globalApiService.get(params).subscribe((data) => {
      this.products = this.productsClone = data;
      if (this.activeProductId) {
        const item = this.products.find(item => item.id === this.activeProductId);
        if (item) {
          this.activeProduct = item;
          this.fetchProductTrackingInfo(item);
        }
      }
    }, err => {
      console.log(err);
    });
  }

  filterByCategory(event) {
    this.fetchProducts(event.value);
  }

  filterByQuery(event) {
    const filteredData = this.productsClone.filter(obj =>
      Object.keys(obj).some(key =>
        String(obj[key]).toLowerCase().includes(event.toLowerCase())
      )
    );
    this.products = filteredData;
  }

  fetchProductTrackingInfo(product) {
    const params = {
      apiName: 'fetch_product_tracking_list',
      queryParams: `?productId=${product.id}`
    };
    this._globalApiService.get(params).subscribe((data) => {
      this.userTrackList.rows = data.list;
      this.analytics = data.analytics?.[0];
    }, err => {

    });
  }

  onToggleChange(item) {
    if (item['showDetails']) {
      item['showDetails'] = false;
      return;
    }
    const params = {
      apiName: 'get_conversion_details',
      queryParams: `?conversionId=${item?.id}`
    }
    this._globalApiService.get(params).subscribe(data => {
      item['showDetails'] = item['showDetails'] ? false : true;
      item['conversionDetails'] = data;
    }, err => {
      console.log(err);
    });
  }

}
