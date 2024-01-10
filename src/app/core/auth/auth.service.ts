import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { getEndPoint } from 'app/helpers/endpoints.constants';
import { User } from '../user/user.types';

@Injectable()
export class AuthService
{
    // studentsignIn(value: any) {
    //   throw new Error('Method not implemented.');
    // }
    private _authenticated: boolean = false;
    private _defaultContent: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _userService: UserService
    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    set defaultContent(value: any)
    {
        // Store the value
        this._defaultContent.next(value);
    }

    get defaultContent$(): Observable<any>
    {
        return this._defaultContent.asObservable();
    }

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string)
    {
        localStorage.setItem(environment.storageItems?.storage_token_key, token);
    }

    set user(userData) {
        const words = userData?.name?.split(' ');
        let userPrefix = '';
        if (words.length === 1) {
            userPrefix = words[0].substring(0, 2);
        } else if (words.length >= 2) {
            userPrefix = words[0].charAt(0) + words[1].charAt(0);
        }
        userData['prefix'] = userPrefix;
        localStorage.setItem(environment.storageItems?.storage_user_key, JSON.stringify(userData));
    }

    get user() {
        return JSON.parse(localStorage.getItem(environment.storageItems?.storage_user_key));
    }

    get accessToken(): string
    {
        return localStorage.getItem(environment.storageItems?.storage_token_key) ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    getDefaultContent(): Observable<any>
    {
        return this._httpClient.get(`${environment.lambdaUrl}/default-content/details`).pipe(
            switchMap((response: any) => {
                this.defaultContent = response;
                return of(response);
            })
        );
    }

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string, reCaptchaToken?:string): Observable<any>
    {
        return this._httpClient.post(getEndPoint('forgot_password'), {email, reCaptchaToken});
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(params): Observable<any>
    {
        return this._httpClient.post(getEndPoint('reset_password'), params);
    }

    /**
     * Verify Account
     *
     * @param token
     * @param signature
     */
    verifyToken(token: string, signature: string): Observable<any>
    {
        return this._httpClient.post<any>(getEndPoint('verify_account'), {
            token: token,
            signature: signature
        });
    }
    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string, reCaptchaToken: any }): Observable<any>
    {
        console.log(credentials);
        // Throw error, if the user is already logged in
        if ( this._authenticated )
        {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post(getEndPoint('login'), credentials).pipe(
            switchMap((response: any) => {

                // Store the access token in the local storage
                this.accessToken = response.token;

                this.user = response.user;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }
    // studentsignIn(credentials: { email: string; password: string, reCaptchaToken: any }): Observable<any>
    // {
    //     console.log(credentials);
    //     // Throw error, if the user is already logged in
    //     if ( this._authenticated )
    //     {
    //         return throwError('User is already logged in.');
    //     }

    //     return this._httpClient.post(getEndPoint('login'), credentials).pipe(
    //         switchMap((response: any) => {

    //             // Store the access token in the local storage
    //             this.accessToken = response.token;

    //             this.user = response.user;

    //             // Set the authenticated flag to true
    //             this._authenticated = true;

    //             // Store the user on the user service
    //             this._userService.user = response.user;

    //             // Return a new observable with the response
    //             return of(response);
    //         })
    //     );
    // }
    

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any>
    {
        // Sign in using the token
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken
        }).pipe(
            catchError(() =>

                // Return false
                of(false)
            ),
            switchMap((response: any) => {

                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if ( response.accessToken )
                {
                    this.accessToken = response.accessToken;
                }

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return true
                return of(true);
            })
        );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any>
    {
        // Remove the access token from the local storage
        localStorage.removeItem(environment.storageItems.storage_token_key);
        localStorage.removeItem(environment.storageItems.storage_user_key);

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: { name: string; email: string; password: string; reCaptchaToken: string }): Observable<any>
    {
        return this._httpClient.post(getEndPoint('register'), user);
    }
    studentsignUp(user: { name: string; email: string; password: string; reCaptchaToken: string }): Observable<any>
    {
        return this._httpClient.post(getEndPoint('register'), user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: { email: string; password: string }): Observable<any>
    {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    check(): Observable<boolean>
    {
        // Check if the user is logged in
        if ( this._authenticated )
        {
            return of(true);
        }

        // Check the access token availability
        if ( !this.accessToken )
        {
            return of(false);
        }

        const user: User = JSON.parse(localStorage.getItem(environment.storageItems.storage_user_key));

        this._userService.user = user;

        return of(true);

        // Check the access token expire date
        /* if ( AuthUtils.isTokenExpired(this.accessToken) )
        {
            return of(false);
        } */

        // If the access token exists and it didn't expire, sign in using it
        //return this.signInUsingToken();
    }
}
