import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector     : 'auth-studentsign-up',
  templateUrl: './studentsign-up.component.html',
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class AuthStudentsignUpComponent implements OnInit
{
    @ViewChild('studentsignUpNgForm') studentsignUpNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    studentsignUpForm: UntypedFormGroup;
    showAlert: boolean = false;

    /**
     * Constructor
     */
    constructor(
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _recaptchaV3Service: ReCaptchaV3Service
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        // Create the form
        this.studentsignUpForm = this._formBuilder.group({
                name      : ['', [Validators.required, Validators.maxLength(25)]],
                email     : ['', [Validators.required, Validators.email]],
                password  : ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={[}\]|\\:;"'<,>.?`~])[A-Za-z\d!@#$%^&*()_+={[}\]|\\:;"'<,>.?`~]{6,16}$/)]],
                agreements: ['', Validators.requiredTrue],
                reCaptchaToken     : [''],
                registrationType:['student'] 
            }
        );
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign up
     */
    studentsignUp(): void
    {
        // Do nothing if the form is invalid
        if ( this.studentsignUpForm.invalid )
        {
            return;
        }

        this._recaptchaV3Service.execute('signUpAction').subscribe((token) => {
            this.studentsignUpForm.patchValue({
                reCaptchaToken: token
            });
            // Disable the form
            this.studentsignUpForm.disable();
            // Hide the alert
            this.showAlert = false;
            // Sign up
            this._authService.studentsignUp(this.studentsignUpForm.value)
            .subscribe(
                (response) => {
                    // Navigate to the confirmation required page
                    this._router.navigateByUrl('/confirmation-required', { state: { message: response.message } });
                },
                (response) => {
                    // Re-enable the form
                    this.studentsignUpForm.enable();
                    // Reset the form
                    if (this.studentsignUpNgForm) {
                        this.studentsignUpNgForm.resetForm();
                    }
                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: response.error?.error || 'Something went wrong, please try again.'
                    };
                    // Show the alert
                    this.showAlert = true;
                }
            );
        }, err => {
            this.showAlert = false;
            this.alert = {
                type   : 'error',
                message: 'Sorry, the request appears to be from a bot and cannot be processed at the moment.'
            };
            this.showAlert = true;
            console.error(err);
        });
    }
}
