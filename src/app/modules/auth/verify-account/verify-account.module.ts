import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerifyAccountComponent } from './verify-account.component';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { VerifyAccountResolver } from './verify-account.resolvers';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAlertModule } from '@fuse/components/alert';

const routes: Routes = [{
  path: '',
  resolve: {
      verificationResponse: VerifyAccountResolver
  },
  component: VerifyAccountComponent
}];

@NgModule({
  declarations: [
    VerifyAccountComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatButtonModule,
    FuseCardModule,
    SharedModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    FuseCardModule,
    FuseAlertModule,
    SharedModule
  ],
  providers: [
    VerifyAccountResolver
  ]
})
export class VerifyAccountModule { }
