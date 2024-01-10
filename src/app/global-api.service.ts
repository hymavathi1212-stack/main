import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of, throwError } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, switchMap } from 'rxjs/operators';
import { getEndPoint } from './helpers/endpoints.constants';
import { User } from './core/user/user.types';
import { UserService } from './core/user/user.service';
import { AuthService } from './core/auth/auth.service';
import { Router } from '@angular/router';

interface IHttpParms {
  apiName: string
  base?: string
  queryParams?: string
  body?: any;
}
@Injectable({
  providedIn: 'root'
})
export class GlobalApiService {
  private userData: User;
  constructor(
    private _httpClient: HttpClient,
    private _userService: UserService,
    private _authService: AuthService,
    private _router: Router
  ) { 
    this._userService.user$.subscribe(data => this.userData = data);
  }

  userInfoByField(field?: string) {
      return field ? this.userData[field] : this.userData;
  }

  prepareApiUrl(params) {
    const url = getEndPoint(params?.apiName)+(params?.queryParams || '');
    return url;
  }
  get(params: IHttpParms): Observable<any> {
		return this._httpClient.get(this.prepareApiUrl(params)).pipe(
      catchError((err) => {
        // Throw an error or return a specific value to indicate failure
        return throwError(err); // or return of(false);
      }),
      switchMap((response: any) => {
          // Return true
          return of(response);
      })
    );
	}

  post(params: IHttpParms): Observable<any> {
		return this._httpClient.post(this.prepareApiUrl(params), params.body).pipe(
      catchError((err) => {
        // Throw an error or return a specific value to indicate failure
        return throwError(err); // or return of(false);
      }),
      switchMap((response: any) => {
          // Return true
          return of(response);
      })
    );
	}

  put(params: IHttpParms): Observable<any> {
		return this._httpClient.put(this.prepareApiUrl(params), params.body).pipe(
      catchError((err) => {
        // Throw an error or return a specific value to indicate failure
        return throwError(err); // or return of(false);
      }),
      switchMap((response: any) => {
          // Return true
          return of(response);
      })
    );
	}
  
  delete(params: IHttpParms): Observable<any> {
		return this._httpClient.delete(this.prepareApiUrl(params)).pipe(
      catchError((err) => {
        // Throw an error or return a specific value to indicate failure
        return throwError(err); // or return of(false);
      }),
      switchMap((response: any) => {
          // Return true
          return of(response);
      })
    );
	}
  
  fetchProfile() {
    const params = {
      apiName: 'fetch_affiliate_profile',
      queryParams: `?additionalDetails=true`
    };
    this.get(params).subscribe((data) => {
      this._authService.user = {...data};
      this._userService.user = this._authService.user;
    }, err => {
      console.log(err);
    });
  }

  signOut() {
    const params = {
      apiName: 'logout'
    };
    this.get(params).subscribe((data) => {
      this._router.navigate(['/sign-out']);
    }, err => {
      console.log(err);
      this._router.navigate(['/sign-out']);
    })
  }

}
