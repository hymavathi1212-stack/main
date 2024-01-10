import { Component, Inject, Input, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatSnackBar,MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { User } from 'app/core/user/user.types';
import { GlobalApiService } from 'app/global-api.service';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  MAT_BOTTOM_SHEET_DATA,
  MatBottomSheet,
  MatBottomSheetConfig,
  MatBottomSheetModule,
  MatBottomSheetRef,
} from '@angular/material/bottom-sheet';
import { SocialShareService } from 'app/social-share.service';
import { AuthService } from 'app/core/auth/auth.service';
@Component({
  selector: 'app-affiliater',
  templateUrl: './affiliater.component.html',
  styleUrls: ['./affiliater.component.scss']
})
export class AffiliaterComponent {
  @ViewChild(TemplateRef) template: TemplateRef<any>;
  @Input() user: User;
  data: any;
  products: any = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'end';
  verticalPosition: MatSnackBarVerticalPosition = 'top';
  dashboard: any;
  dataFetched: boolean = false;
  defaultContent: any = {};
  constructor(
    private _snackBar: MatSnackBar,
    private _globalApiService: GlobalApiService,
    private _clipboard: Clipboard,
    readonly _bottomSheet: MatBottomSheet,
    private _authService: AuthService
  ) {
    this._authService.defaultContent$.subscribe((data) => {
      this.defaultContent = data;
    });
  }
  fetchDashboard() {
    const params = {
        apiName: 'user_dashboard'
    };
    this._globalApiService.get(params).subscribe((data) => {
        this.dashboard = data;
    }, err => {
        this.dashboard = {};
    });
  }
  ngOnChanges(changes: any) {
    if (changes && !changes?.user?.currentValue?.redirectProfile && changes?.user?.currentValue?.profileVerified === 1) {
      this.loadActiveProducts();
      this.fetchDashboard();
    }
  }
  copyAffiliateLink(product) {
    if (product?.short_url) {
        return this.copyToClipBoard(product);
    }
    const params = {
        apiName: 'get_short_url',
        body: {
            productId: product.id
        }
    };
    this._globalApiService.post(params).subscribe((data) => {
        product['short_url'] = data['url'];
        this.copyToClipBoard(product);
    }, err => {
        console.log(err);
    });
  }
  copyToClipBoard(product) {
    return this._bottomSheet.open(CopyAffiliateLinkSheet, {
      data: {
        product
      },
      hasBackdrop: true,
      disableClose: true
    });
    /* if (text) {
        this._clipboard.copy(text);
    }
    this._snackBar.open(`Copied successfully !`, `Okay`, {
        horizontalPosition: this.horizontalPosition,
        verticalPosition: this.verticalPosition,
        duration: 3000
    }); */
  }
  loadActiveProducts() {
    const params = {
        apiName: 'fetch_affiliate_products_with_filter',
        queryParams: `?filterBy=active`
    };
    this._globalApiService.get(params).subscribe((data) => {
        this.products = data;
        this.dataFetched = true;
    }, err => {
        this._snackBar.open(`Failed to load affiliate products !`, `Okay`, {
            horizontalPosition: this.horizontalPosition,
            verticalPosition: this.verticalPosition,
            duration: 2000
        });
        this.dataFetched = true;
    });
  }
  open(product) {
    return this._bottomSheet.open(CopyAffiliateLinkSheet, {
      data: {
        product
      },
      hasBackdrop: true,
      disableClose: true
    });
  }
}

@Component({
  selector: 'copy-affiliate-link-sheet',
  templateUrl: 'copy-affiliate-link-sheet.html',
  styleUrls: ['./affiliater.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CopyAffiliateLinkSheet {
  public messageContent: string = ``;
  constructor(
    private _snackBar: MatSnackBar,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private _bottomSheetRef: MatBottomSheetRef<CopyAffiliateLinkSheet>,
    private _socialShareService: SocialShareService
  ) {
    this.messageContent = `🌟 Check out this amazing ${this.data?.product?.productTitle}! 😍 Get it now and enjoy the exclusive discount! 💸`;
  }

  openLink(event: MouseEvent): void {
    this._bottomSheetRef.dismiss();
    event.preventDefault();
  }

  closeSheet() {
    this._bottomSheetRef.dismiss();
  }
  
  share(type) {
    this._socialShareService.share({
      platform: type,
      url: this.data.product?.short_url,
      title: this.messageContent,
      description: this.messageContent
    });
    if (type === 'COPY' || type === 'COPY-LINK') {
      this._snackBar.open(`Copied successfully !`, `Okay`, {
          horizontalPosition: 'right',
          verticalPosition: 'bottom',
          duration: 3000
      });
    }
  }
}