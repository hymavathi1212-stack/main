import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStudentconfirmationRequiredComponent}from '../studentconfirmation-required/studentconfirmation-required.component';
import { MatButtonModule } from '@angular/material/button';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { authstudentConfirmationRequiredRoutes } from 'app/modules/auth/studentconfirmation-required/studentconfirmation-required.routing';
import { RouterModule } from '@angular/router';




@NgModule({
  declarations: [
    AuthStudentconfirmationRequiredComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(authstudentConfirmationRequiredRoutes),
    MatButtonModule,
    FuseCardModule,
    SharedModule
]
})
export class AuthStudentconfirmationRequiredModule { }
