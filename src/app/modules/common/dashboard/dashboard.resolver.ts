import { Injectable } from '@angular/core';
import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/core/user/user.types';
import { Observable, of } from 'rxjs';

@Injectable()
export class DashboardResolver implements Resolve<boolean> {
  private user: User;
  constructor(
    private _router: Router,
    private _userService: UserService
  ) {
    this._userService.user$.subscribe((user) => {
        console.log('userDetails', user);
        this.user = user;
    });
  }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const redirectUrl = this.user?.roleId === 1 ? '/affliater' : this.user?.roleId === 3 ? '/admin' : '';
    if (state.url === '/dashboard' && redirectUrl) {
      this._router.navigateByUrl(`${redirectUrl}/dashboard`);
    }
    return of(true);
  }
}
