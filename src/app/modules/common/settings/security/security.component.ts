import { ChangeDetectionStrategy, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators} from '@angular/forms';
import { GlobalApiService } from 'app/global-api.service';
import { FuseAlertType } from '@fuse/components/alert';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector       : 'settings-security',
    templateUrl    : './security.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    animations: fuseAnimations
})
export class SettingsSecurityComponent implements OnInit
{
    @ViewChild('securityNgForm') securityNgForm: NgForm;

    alert: { type: FuseAlertType; message: string } = {
        type   : 'success',
        message: ''
    };
    securityForm: UntypedFormGroup;
    showAlert: boolean = false;

    constructor(
        private _formBuilder: UntypedFormBuilder,
        private _globalApiService: GlobalApiService
    )
    {

    }

    ngOnInit(): void
    {
        this.securityForm = this._formBuilder.group({
            currentPassword  : (['', Validators.required]),
            newPassword  : ['', [Validators.required, Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+={[}\]|\\:;"'<,>.?`~])[A-Za-z\d!@#$%^&*()_+={[}\]|\\:;"'<,>.?`~]{6,16}$/)]]
        });
    }

    changPassword(): void {
        this.showAlert = false;
        if ( this.securityForm.invalid )
        {
            return;
        }
        if (this.securityForm.value.currentPassword === this.securityForm.value.newPassword) {
            this.alert = {
                type: 'error',
                message: `New password can not be same as old password`
            }
            this.showAlert = true;
            return;
        }
        // Disable the form
        this.securityForm.disable();
        const params = {
          apiName: 'change_password',
          body: {
            oldPassword: this.securityForm.value.currentPassword,
            newPassword: this.securityForm.value.newPassword,
          }
        }
        this._globalApiService.post(params).subscribe((data) => {
            this.securityForm.enable();
            this.securityNgForm.resetForm();
            this.alert = {
                type   : 'success',
                message: data.message || 'Password has been changed successfully'
            };
            this.showAlert = true;
        },
        (err) => {
            this.securityForm.enable();
            this.securityNgForm.resetForm();
            if (err?.error?.error) {
                this.alert = {
                    type: 'error',
                    message: err?.error?.error
                }
                this.showAlert = true;
            }
        })
    }
}