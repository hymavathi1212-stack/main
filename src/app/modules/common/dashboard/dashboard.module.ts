import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { Route, RouterModule } from '@angular/router';
import { DashboardResolver } from './dashboard.resolver';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslocoModule } from '@ngneat/transloco';
import { NgApexchartsModule } from 'ng-apexcharts';
import { SharedModule } from 'app/shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { AdminComponent } from './admin/admin.component';
import { AffiliaterComponent, CopyAffiliateLinkSheet } from './affiliater/affiliater.component';


const exampleRoutes: Route[] = [
  {
      path     : '',
      component: DashboardComponent,
      resolve: {
          initialData: DashboardResolver,
      }
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    AdminComponent,
    AffiliaterComponent,
    CopyAffiliateLinkSheet
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(exampleRoutes),
    MatButtonModule,
    MatButtonToggleModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatRippleModule,
    MatSidenavModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    NgApexchartsModule,
    TranslocoModule,
    SharedModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatBottomSheetModule,
    ClipboardModule
  ],
  providers: [
    DashboardResolver
  ]
})
export class DashboardModule { }
