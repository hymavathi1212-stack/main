import { Component, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { GlobalApiService } from 'app/global-api.service';
import { DateTime } from 'luxon';
import { FuseConfirmationService } from '@fuse/services/confirmation';
@Component({
  selector: 'app-affliate-profile',
  templateUrl: './affliate-profile.component.html',
  styleUrls: ['./affliate-profile.component.scss'],
  animations   : fuseAnimations
})
export class AffliateProfileComponent implements OnInit {
  
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _globalApiService: GlobalApiService,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService
  ) {
    
  }
  affiliateProfileForm: UntypedFormGroup;
  profile: any;
  minDate = DateTime.now().minus({ years: 100 });
  maxDate = DateTime.now().minus({ years: 18 });
  processingRequest: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type   : 'success',
    message: ''
  };
  showAlert: boolean = false;
  dob: string;
  showSocialError: boolean = false;
  ngOnInit(): void {
    this.fetchProfileInfo();
    this.affiliateProfileForm = this._formBuilder.group({
      basicDetails: this._formBuilder.group({
          name    : ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
          email   : [{
            value: '',
            disabled: true
          }, [Validators.required, Validators.email]],
          mobile  : ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^(?:[6789]\d{9})$/)]],
          dob     : ['', [Validators.required]],
          gender  : ['', [Validators.required]],
          qualification: ['', [Validators.required]]
      }),
      bankDetails: this._formBuilder.group({
          accountName: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
          accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)]],
          ifsc: ['', [Validators.required, Validators.pattern(/^[A-Za-z]{4}[0][a-zA-Z0-9]{6}$/)]],
          accountType: ['', Validators.required],
          aadhaarNumber: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(12)]],
          panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]]
      }),
      socialLinks: this._formBuilder.group({
          website: ['', [Validators.pattern('^(https?://)?([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$')]],
          instagramUrl : ['', [Validators.pattern(/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:[a-zA-Z0-9_\.]{1,30}(?:\/)?)?$/)]],
          fbUrl : ['', [Validators.pattern(/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:facebook\.com|fb\.me)\/(?:profile\.php\?id=)?(?:[a-zA-Z0-9.\-]+\/)?(?:[a-zA-Z0-9.\-]+)?$/)]],
          twitterUrl    : ['', [Validators.pattern(/^(?:http(?:s)?:\/\/)?(?:www\.)?twitter\.com\/(?:#!\/)?[a-zA-Z0-9_]{1,15}(?:\/\w+)*$/)]],
          youtubeUrl: ['', [Validators.pattern(/^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:c\/|channel\/|user\/))([^\s&?\/]+)/)]]
      })
    });
  }

  showConfirmAlert() {
    const dialogRef = this._fuseConfirmationService.open({
      title: 'Profile Update Requires Verification Approval',
      message: 'When you update your profile, it will undergo an approval process again. During this time, your current affiliate program will be temporarily paused until the verification approval is granted.',
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
          this.saveDetails(true);
        }
    });
  }

  fetchProfileInfo() {
    const params = {
      apiName: 'fetch_affiliate_profile'
    }
    this._globalApiService.get(params).subscribe((data) => {
      this.profile = data;
      if (this.profile?.profileRedirectionObj?.forceDisable) {
        this.processingRequest = true;
        this.affiliateProfileForm.disable();
      }
      this.updateFormValues();
    }, err => {
      console.log(err);
    })
  }

  disableFields() {
    const shouldDisable = this.profile.accountVerified === 1;
    if (shouldDisable) {
      this.affiliateProfileForm.controls['basicDetails']?.get('mobile')?.disable();
      this.affiliateProfileForm.controls['bankDetails']?.disable();
    }
  }

  updateFormValues() {
    this.affiliateProfileForm.controls['basicDetails']?.patchValue({
      name: this.profile?.name,
      email: this.profile?.email,
      mobile: this.profile?.mobile,
      dob: this.profile?.dob,
      gender: this.profile?.gender,
      qualification: this.profile?.qualification
    });
    this.affiliateProfileForm.controls['bankDetails']?.patchValue({
      accountName: this.profile?.accountName,
      accountNumber: this.profile?.accountNumber,
      ifsc: this.profile?.ifsc,
      accountType: this.profile?.accountType,
      aadhaarNumber: this.profile?.aadhaarNumber,
      panNumber: this.profile?.panNumber
    });
    this.affiliateProfileForm.controls['socialLinks']?.patchValue({
      website: this.profile.website,
      instagramUrl : this.profile.instagramUrl,
      fbUrl : this.profile.fbUrl,
      twitterUrl    : this.profile.twitterUrl,
      youtubeUrl: this.profile.youtubeUrl
    });
    this.disableFields();
  } 

  isAtLeastOneFieldFilled(formGroup: FormGroup): boolean {
    for (const controlName in formGroup.controls) {
      if (formGroup.controls.hasOwnProperty(controlName)) {
        const control = formGroup.controls[controlName];
        if (control.value) {
          return true;
        }
      }
    }
    return false;
  }

  saveDetails(ignoreAlert=false) {
    this.showSocialError = false;
    const isFilled: boolean = this.isAtLeastOneFieldFilled(this.affiliateProfileForm.controls['socialLinks'] as FormGroup);
    if (!isFilled) {
      return this.showSocialError = true;
    }
    if (!ignoreAlert && this.profile.profileVerified !== 2 && this.profile.mobile) {
      return this.showConfirmAlert()
    }
    this.showAlert = false;
    this.affiliateProfileForm.value.basicDetails['dob'] = DateTime.fromISO(this.affiliateProfileForm.value.basicDetails['dob']).toFormat('yyyy-MM-dd');
    this.affiliateProfileForm.value.bankDetails.accountNumber = this.affiliateProfileForm.value.bankDetails.accountNumber?.toString();
    this.affiliateProfileForm.value.bankDetails.aadhaarNumber = this.affiliateProfileForm.value.bankDetails.aadhaarNumber?.toString();
    const params = {
      apiName: 'save_profile',
      body: {
        ...this.affiliateProfileForm.value?.basicDetails,
        ...this.affiliateProfileForm.value?.bankDetails,
        ...this.affiliateProfileForm.value?.socialLinks,
      }
    };
    this.processingRequest = true;
    this._globalApiService.post(params).subscribe((data) => {
      this.processingRequest = false;
      this._globalApiService.fetchProfile();
      this.alert = {
        type   : 'success',
        message: (data?.message || 'Profile has been saved successfully !') + ' Redirecting to dashboard...'
      };
      this.showAlert = true;
      setTimeout(() => {
        this._router.navigate(['/affliater/dashboard']);
      }, 3000);
    }, err => {
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

}
