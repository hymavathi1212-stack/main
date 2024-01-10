import { Component, Input, OnInit } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { GlobalApiService } from 'app/global-api.service';
@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  @Input() user: User;
  dashboardData: any = {};
  constructor(private _globalApiService: GlobalApiService) {

  }
  ngOnInit(): void {
    this.fetchDashboardData();
  }
  fetchDashboardData() {
    const params = {
      apiName: 'admin_stats'
    };
    this._globalApiService.get(params).subscribe(data => {
      console.log(data);
      this.dashboardData = data.dashboard;
    }, err => {
      console.log(err);
    });
  }
}
