import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { GlobalApiService } from './global-api.service';

@Injectable({
    providedIn: 'root'
})
export class GlobalHttpErrorInterceptor implements HttpInterceptor {
    private isAlertShown = false;
    constructor(private _globalApiService: GlobalApiService) {

    }
    intercept(request: HttpRequest<any>, next: HttpHandler) {
        return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 403 && !this.isAlertShown) {
                this.isAlertShown = true;
                alert(`Your session has been expired ! Logging out please try to re-login again !`);
                setTimeout(() => {
                    this._globalApiService.signOut();
                },3000);
            }
            
            // Pass the error through to the calling code
            return throwError(error);
        })
        );
    }
}