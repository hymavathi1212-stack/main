import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, ReplaySubject, of, tap } from 'rxjs';
import { Navigation } from 'app/core/navigation/navigation.types';
import { navigationItems } from './navigation.constants';
import { UserService } from '../user/user.service';
import { User } from '../user/user.types';

@Injectable({
    providedIn: 'root'
})
export class NavigationService
{
    private _navigation: ReplaySubject<Navigation> = new ReplaySubject<Navigation>(1);
    private user: User;
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userServie: UserService
    )
    {
        this._userServie.user$.subscribe(data => {
            this.user = data
        });
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for navigation
     */
    get navigation$(): Observable<Navigation>
    {
        return this._navigation.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Get all navigation data
     */
    get(): Observable<Navigation>
    {
        let navigationItemData ;
        // this.user?.roleId === 3 ? 'admin' : (this.user?.profileVerified === 1 ? 'verifiedAffiliater' : 'affliater');
        switch(this.user.roleId){
            case 3:
                navigationItemData= navigationItems('admin')
            break;
            case 1:
                navigationItemData= navigationItems('verifiedAffiliater')
            break;
            case 1:
                navigationItemData= navigationItems('affliater')
            break;
            case 2:
                navigationItemData= navigationItems('student')
            break;
            case 5:
                navigationItemData= navigationItems('verifiedStudent')
            break;
        }

        this._navigation.next(navigationItemData);
        return of(navigationItemData);
        /* return this._httpClient.get<Navigation>('api/common/navigation').pipe(
            tap((navigation) => {
                console.log(navigation, 'NAVIGATIOn')
                this._navigation.next(navigation);
            })
        ); */
    }
}
