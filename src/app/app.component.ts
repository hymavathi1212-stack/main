import { Component } from '@angular/core';
import { UserService } from './core/user/user.service';
import { take } from 'rxjs';
import { GlobalApiService } from './global-api.service';
import { AuthService } from './core/auth/auth.service';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    /**
     * Constructor
     */
    constructor(
        private _userService: UserService,
        private _authService: AuthService,
        private _globalApiService: GlobalApiService
    )
    {
        this._userService.user$.pipe(take(1)).subscribe((user) => {
            if (user) {
                this._globalApiService.fetchProfile();
            }
        });
        this._authService.getDefaultContent().subscribe((data) => {
        });
    }
}
