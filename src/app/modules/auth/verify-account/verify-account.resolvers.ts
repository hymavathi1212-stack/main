import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, of } from 'rxjs';

@Injectable()
export class VerifyAccountResolver implements Resolve<boolean> {
  constructor(
    private _router: Router,
    private _authService: AuthService
  ) {
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this._authService.verifyToken(route.queryParams['token'], route.queryParams['Signature']);
  }
}
