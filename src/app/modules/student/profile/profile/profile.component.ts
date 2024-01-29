import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { GlobalApiService } from 'app/global-api.service';
import { DateTime } from 'luxon';
import { FuseConfirmationService } from '@fuse/services/confirmation';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: fuseAnimations
})

export class ProfileComponent implements OnInit {

verticalStepperbasicDetails: any;
  Studentprofile: any;
 


  constructor(
    private _formBuilder: FormBuilder,
    private _globalApiService: GlobalApiService,
    private _router: Router,
    private _fuseConfirmationService: FuseConfirmationService,
    private http:HttpClient,
    private route:ActivatedRoute
  ) {}

  studentProfileForm: FormGroup;
  profile: any;
  minDate = DateTime.now().minus({ years: 100 });
  maxDate = DateTime.now().minus({ years: 18 });
  processingRequest: boolean = false;
  alert: { type: FuseAlertType; message: string } = {
    type: 'success',
    message: ''
  };
  showAlert: boolean = false;
  dob: string;
  showSocialError: boolean = false;

  ngOnInit(): void {
    // this.fetchStudentProfileInfo();
    this.studentProfileForm = this._formBuilder.group({
      basicDetails: this._formBuilder.group({
        name: ['', [Validators.required, Validators.pattern(/^[A-Za-z\s]+$/)]],
        email: ['', [Validators.required, Validators.email]],
        mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern(/^(?:[6789]\d{9})$/)]],
        dob: ['', [Validators.required]],
        gender: ['', [Validators.required]],
        qualification: ['', [Validators.required]],
        address:['',[Validators.required,Validators.pattern(/^[A-Za-z\s]+$/)]],
        city:['',[Validators.required]],
        website: ['', [Validators.pattern('^(https?://)?([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$')]],
        instagramUrl : ['', [Validators.pattern(/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:instagram\.com|instagr\.am)\/(?:[a-zA-Z0-9_\.]{1,30}(?:\/)?)?$/)]],
      }),
    
      
    });
  }
  showConfirmAlert() {
    const dialogRef = this._fuseConfirmationService.open({
      title: 'Profile Update Requires Verification Approval',
      message: 'When you update your profile, it will undergo an approval process again. During this time, your current student program will be temporarily paused until the verification approval is granted.',
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

  fetchStudentProfileInfo() {
    const params = {
      apiName: 'fetch_student_profile',
      queryParams: `?studentprofileadditionalDetails=true`
    };
   
    this._globalApiService.get(params).subscribe((data) => {
      this.profile = data;
      if (this.profile?.profileRedirectionObj?.forceDisable) {
        this.processingRequest = true;
        this.studentProfileForm.disable();
      }
      this.updateFormValues();
    }, err => {
      console.log(err);
    })
  }

 
  // disableFields() {
  //   const shouldDisable = this.profile.accountVerified === 1;
  //   if (shouldDisable) {
  //     this.studentProfileForm.controls['basicDetails']?.get('mobile')?.disable();
      
  //   }
  // }
  disableFields() {
    if (this.profile && this.profile.accountVerified === 1) {
      const mobileControl = this.studentProfileForm.get('basicDetails')?.get('mobile');
      
      if (mobileControl) {
        mobileControl.disable();
      }
    }
  }

  updateFormValues() {
    this.studentProfileForm.controls['basicDetails']?.patchValue({
      name: this.profile?.name,
      email: this.profile?.email,
      mobile: this.profile?.mobile,
      dob: this.profile?.dob,
      gender: this.profile?.gender,
      qualification: this.profile?.qualification,
      address: this.profile?.address,
      city:this.profile?.city,
      website: this.profile?.website,
      instagramUrl : this.profile?.instagramUrl,
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
    const isFilled: boolean = this.isAtLeastOneFieldFilled(this.studentProfileForm.controls['basicDetails'] as FormGroup);
    if (!this.studentProfileForm.controls['basicDetails'] || !isFilled) {
      return this.showSocialError = true;
    }
    if (!ignoreAlert && this.profile.profileVerified !== 1 && this.profile.mobile) {
      return this.showConfirmAlert()
    }
    this.showAlert = false;
    this.studentProfileForm.value.basicDetails['dob'] = DateTime.fromISO(this.studentProfileForm.value.basicDetails['dob']).toFormat('yyyy-MM-dd');
    
   
    const params = {
      apiName: 'save_profile',
      body: {
        ...this.studentProfileForm.value?.basicDetails,
       
        
      }
    };
    this.processingRequest = true;
    this._globalApiService.post(params).subscribe((data) => {
      this.processingRequest = false;
      this._globalApiService.fetchStudentProfile();
      this.alert = {
        type   : 'success',
        message: (data?.message || 'Profile has been saved successfully !') + ' Redirecting to dashboard...'
      };
      this.showAlert = true;
      setTimeout(() => {
        this._router.navigate(['/student/dashboard']);
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


 

