import { Component, OnInit } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { UserService } from 'app/core/user/user.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  user: User;
  profileStatusIconMeta: any = {
    1: {
        iconName: 'heroicons_solid:shield-check',
        iconColor: 'text-green-500',
        hint: 'Profile Fully Verified'
    },
    2: {
        iconName: 'heroicons_solid:shield-exclamation',
        iconColor: 'text-teal-500',
        hint: 'Under Verification'
    },
    3: {
        iconName: 'heroicons_solid:x-circle',
        iconColor: 'text-red-900',
        hint: 'Rejected'
    },
    4: {
      iconName: 'heroicons_solid:x-circle',
      iconColor: 'text-violet-500',
      hint: 'On Hold'
    },
    0: {
        iconName: 'heroicons_solid:information-circle',
        iconColor: 'text-primary-600',
        hint: 'InComplete Profile'
    }
  };
  public activeProfileStatus = null;
  constructor(
    private _userService: UserService
  )
  {
   
  }
  ngOnInit(): void {
    this._userService.user$.subscribe((data) => {
        this.user = data;
        this.activeProfileStatus = this.profileStatusIconMeta[this.user?.profileVerified]
    });
  }
}
