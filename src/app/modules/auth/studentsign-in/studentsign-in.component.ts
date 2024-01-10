import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { GlobalApiService } from 'app/global-api.service';
import { ReCaptchaV3Service } from 'ng-recaptcha';

@Component({
  selector: 'app-studentsign-in',
  templateUrl: './studentsign-in.component.html',
  encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthStudentsignInComponent implements OnInit
{
    @ViewChild('studentsignInNgForm') studentsignInNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    signInForm: UntypedFormGroup;
    showAlert: boolean = false;
    public siteKey: string = '6LdwEAInAAAAAMl-meWa2HjDstPaAOPNufp2Lxrb';
studentsignInForm: any;
    //6LdwEAInAAAAANXPVrLbq4S__n7VNB91HFIHF8oU

    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private _formBuilder: UntypedFormBuilder,
        private _router: Router,
        private _globalApiService: GlobalApiService,
        private _recaptchaV3Service: ReCaptchaV3Service
    )
    {
    }

    handleCaptchaResponse(response: string) {
        // Send the response to the backend for verification
        /* this._recaptchaV3Service.execute(this.siteKey, 'signin_submit', (res) => {
            console.log(res, 'Response');
        }) */
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
        this.signInForm = this._formBuilder.group({
            email     : ['', [Validators.required, Validators.email]],
            password  : ['', Validators.required],
            reCaptchaToken: ['']
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Sign in
     */
    signIn(): void
    {
        // Return if the form is invalid
        if ( this.studentsignInForm.invalid )
        {
            return;
        }

        this._recaptchaV3Service.execute('signInAction').subscribe((token) => {
            this.signInForm.patchValue({
                reCaptchaToken: token
            });
            // Disable the form
            this.signInForm.disable();
            // Hide the alert
            this.showAlert = false;
            // Sign in
            this._authService.signIn(this.studentsignInForm.value)
            .subscribe(
                () => {
                    // Set the redirect url.
                    // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
                    // to the correct page after a successful sign in. This way, that url can be set via
                    // routing file and we don't have to touch here.
                    const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
                    // Navigate to the redirect url
                    this._router.navigateByUrl(redirectURL);
                    setTimeout(() => {
                        this._globalApiService.fetchProfile();
                    },1000);
                },
                (response) => {
                    // Re-enable the form
                    this.signInForm.enable();
                    // Reset the form
                    //this.signInNgForm.resetForm();
                    // Set the alert
                    this.alert = {
                        type   : 'error',
                        message: response.error?.error || 'Wrong email or password'
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
