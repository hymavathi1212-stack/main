import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormBuilder, UntypedFormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { GlobalApiService } from 'app/global-api.service';
import { DateTime } from 'luxon';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  animations: fuseAnimations
})
export class CreateComponent implements OnInit {

  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _globalApiService: GlobalApiService,
    private _router: Router
  ) {

  }
  createProductForm: UntypedFormGroup;
  product: any;
  minDate = DateTime.now().plus({ days: 1});
//   maxDate = DateTime.now().minus({ years: 18 });
  processingRequest: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type   : 'success',
    message: ''
  };
  showAlert: boolean = false;
  dob: string;
  profileTypes: Array<any> = [];
  profileTypeModel: any = {};
  ngOnInit(): void {
    this.createProductForm = this._formBuilder.group({
        productDetails: this._formBuilder.group({
            productTitle    : ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
            productDescription  : ['', [Validators.minLength(5), Validators.maxLength(1000)]],
            price : ['', [Validators.required, Validators.minLength(1), Validators.maxLength(10), Validators.pattern(/^\d+(\.\d+)?$/)]],
            offerPrice  : ['', [Validators.minLength(1), Validators.maxLength(10), Validators.pattern(/^\d+(\.\d+)?$/), offerPriceValidator]],
            image: ['', [Validators.pattern(/^(https?:\/\/)?([\w.]+)\.([a-z]{2,6}\.?)(\/[\w.]*)*\/?$/i)]],
            productUrl:['', [Validators.required, Validators.pattern(/^(https?:\/\/)?([\w.-]+)\.([a-zA-Z]{2,})(\/\S*)?$/)]],
            expiryDate     : [''],
        }),
        commisionSection: this._formBuilder.group({})
    });
    this.fetchProfileTypes();
  }

  saveDetails() {
    this.showAlert = false;
    if (this.createProductForm.value.productDetails['expiryDate']) {
      this.createProductForm.value.productDetails['expiryDate'] = DateTime.fromISO(this.createProductForm.value.productDetails['expiryDate']).toFormat('yyyy-MM-dd');
    }
    const productParams = this.createProductForm.value.productDetails;
    const commission = [];
    for (let eachItem in this.profileTypeModel) {
      if (this.profileTypeModel[eachItem]) {
        commission.push({
          id: parseInt(eachItem),
          commissionRate: parseFloat(this.profileTypeModel[eachItem])
        });
      }
    }
    if (Object.keys(this.profileTypeModel).length !== commission.length) {
      return;
    }
    const params = {
      apiName: 'save_product',
      body: {
        productTitle: productParams?.productTitle,
        productDescription: productParams?.productDescription,
        price: parseFloat(productParams?.price),
        offerPrice: productParams?.offerPrice ? parseFloat(productParams?.offerPrice) : 0,
        image: productParams?.image,
        productUrl: productParams?.productUrl,
        expiryDate: this.createProductForm.value.productDetails['expiryDate'] || null,
        commission: commission
      }
    };
    this.processingRequest = true;
    this._globalApiService.post(params).subscribe((data) => {
        console.log(data);
      this.processingRequest = false;
      this.alert = {
        type   : 'success',
        message: (data?.message || 'Product has been saved successfully !') + ' Redirecting to product list...'
      };
      setTimeout(() => {
        this._router.navigate(['/admin/products/list']);
      }, 1000)
      this.showAlert = true;
    }, err => {
      console.log(err);
      let errorMessage = '';
      if (err.error?.length > 0) {
        err.error.map(item => {
          errorMessage += `${item?.instancePath.replace('/', '')} ${item?.message} </br>`
        });
      }
      this.alert = {
          type   : 'error',
          message: err.error?.error || (errorMessage || 'Something went wrong !')
      };
      this.showAlert = true;
      this.processingRequest = false;
    });
  }

  fetchProfileTypes(): void {
    const params = {
      apiName: 'fetch_profile_types'
    }
    this._globalApiService.get(params).subscribe((data) => {
      this.profileTypes = data;
      this.profileTypes.map(item => {
        this.profileTypeModel[item.id] = null;
      })
    }, err => {
      
    });
  }

}

function offerPriceValidator(control: AbstractControl): ValidationErrors | null {
  const priceControl = control.root.get('productDetails')?.get('price');
  if (priceControl && !priceControl.value) {
    return { priceValueRequired: true };
  }
  if (priceControl && parseFloat(control.value) >= parseFloat(priceControl.value)) {
    return { offerPriceExceeded: true }; // Return an error object if offerPrice is more than price
  }
  return null; // Return null if validation passes
}