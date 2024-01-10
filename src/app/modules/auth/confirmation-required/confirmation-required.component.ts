import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { Router } from '@angular/router';

@Component({
    selector     : 'auth-confirmation-required',
    templateUrl  : './confirmation-required.component.html',
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AuthConfirmationRequiredComponent
{
    public message: string = '';
    /**
     * Constructor
     */
    constructor(private router: Router)
    {
        const currentNavigation = this.router.getCurrentNavigation();
        if (currentNavigation && currentNavigation.extras && currentNavigation.extras.state) {
            const customData = currentNavigation.extras.state;
            this.message = customData?.message;
        } else {
            this.router.navigateByUrl('/');
        }
    }
}
