import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-verify-account',
  templateUrl: './verify-account.component.html',
  styleUrls: ['./verify-account.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations   : fuseAnimations
})
export class VerifyAccountComponent implements OnInit {
  @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm;
  resolvedData: any;
  alert: { type: FuseAlertType; message: string } = {
      type   : 'success',
      message: ''
  };
  forgotPasswordForm: UntypedFormGroup;
  showAlert: boolean = false;
  forgotPasswordRequest: boolean = false;
  disableFormAfterReset: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private _formBuilder: UntypedFormBuilder,
    private _authService: AuthService,
  ) {
    this.resolvedData = this.route.snapshot.data['verificationResponse'];
    this.forgotPasswordRequest = (this.route.snapshot.queryParams['RT'] === 'fg' && this.resolvedData.data?.allow);
  }

  ngOnInit(): void {
    this.forgotPasswordForm = this._formBuilder.group({
        password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={[}\]|\\:;"'<,>.?`~])[A-Za-z\d!@#$%^&*()_+={[}\]|\\:;"'<,>.?`~]{6,16}$/)]]
    });
  }

  resetPassword(): void {
    // Return if the form is invalid
    if ( this.forgotPasswordForm.invalid )
    {
        return;
    }

    // Disable the form
    this.forgotPasswordForm.disable();

    // Hide the alert
    this.showAlert = false;

    // Forgot password
    this._authService.resetPassword({
      password: this.forgotPasswordForm.get('password').value,
      token: this.route.snapshot.queryParams['token'],
      signature: this.route.snapshot.queryParams['Signature']
    }).pipe(
            finalize(() => {

                // Re-enable the form
                this.forgotPasswordForm.enable();

                // Reset the form
                this.forgotPasswordNgForm.resetForm();

                // Show the alert
                this.showAlert = true;
            })
        )
        .subscribe(
            (response) => {

                this.disableFormAfterReset = true;
                // Set the alert
                this.alert = {
                    type   : 'success',
                    message: response.message
                };
            },
            (response) => {

                // Set the alert
                this.alert = {
                    type   : 'error',
                    message: response?.error?.error || 'Something went wrong ! Please contact support'
                };
            }
        );
  }
}
