import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { SettingsAccountComponent } from './account/account.component';
import { SettingsSecurityComponent } from './security/security.component';
import { Route, RouterModule } from '@angular/router';
import { SharedModule } from 'app/shared/shared.module';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseCardModule } from '@fuse/components/card';

const settingsRoutes: Route[] = [{
  path: '',
  component: SettingsComponent
}];

@NgModule({
  declarations: [
    SettingsComponent,
    SettingsAccountComponent,
    SettingsSecurityComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(settingsRoutes),
    MatIconModule,
    SharedModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    MatSlideToggleModule,
    MatSelectModule,
    MatSidenavModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    FuseAlertModule,
    FuseCardModule,
    SharedModule
  ]
})
export class SettingsModule { }
