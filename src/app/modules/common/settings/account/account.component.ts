import { ChangeDetectionStrategy, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { User } from 'app/core/user/user.types';

@Component({
    selector       : 'settings-account',
    templateUrl    : './account.component.html',
    encapsulation  : ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class SettingsAccountComponent implements OnInit
{
    @Input('user') user: User;
    accountForm: UntypedFormGroup;
    userData: any;
    constructor(
        private _formBuilder: UntypedFormBuilder
    )
    {
        this.accountForm = this._formBuilder.group({
            name : new FormControl({ value: '', disabled: true }),
            email : new FormControl({ value: '', disabled: true }),
            mobile: new FormControl({ value: '', disabled: true }),
            gender: new FormControl({ value: '', disabled: true }),
            dob: new FormControl({ value: '', disabled: true })
        });
    }

    ngOnInit(): void
    {
      this.accountForm.patchValue({
        name: this.user.name,
        email: this.user.email,
        mobile: this.user.mobile,
        gender: this.user.gender,
        dob: this.user.dob
      });
    }
}