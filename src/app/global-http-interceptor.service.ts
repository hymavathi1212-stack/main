import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserService } from './core/user/user.service';
import { AuthService } from './core/auth/auth.service';
import { User } from './core/user/user.types';
import { getEndPoint } from './helpers/endpoints.constants';
import { environment } from 'environments/environment';

@Injectable({
    providedIn: 'root'
})
export class GlobalHttpInterceptor implements HttpInterceptor {
  private nonAuthenticatedRoutes: Array<string> = [
    getEndPoint('login'),
    getEndPoint('register'),
    getEndPoint('verify_account'),
    getEndPoint('forgot_password'),
    getEndPoint('reset_password')
  ];
  private user: User;
  constructor(
    private _userService: UserService,
    private _authService: AuthService
  ) {
    this._userService.user$.subscribe(data => this.user = data);
  }
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add your interception logic here
    // Modify the request, handle the response, etc.
    if (this.nonAuthenticatedRoutes.includes(request.url) || !request.url.includes(environment.apiUrl)) {
        return next.handle(request);
    }
    if (request.url.includes(environment.apiUrl)) {
        const authReq = request.clone({
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              'x-auth-token': this._authService.accessToken,
              'x-requester': this.user.id?.toString()
            })
        });
        return next.handle(authReq); // Forward the request to the next interceptor or the final HTTP handler
    }
  }
}