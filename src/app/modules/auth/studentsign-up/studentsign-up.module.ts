import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthStudentsignUpComponent } from './studentsign-up.component';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseCardModule } from '@fuse/components/card';
import { FuseAlertModule } from '@fuse/components/alert';
import { SharedModule } from 'app/shared/shared.module';
import { authstudentSignupRoutes } from 'app/modules/auth/studentsign-up/studentsign-up.routing';


@NgModule({
  declarations: [ AuthStudentsignUpComponent],
  imports: [
    RouterModule.forChild(authstudentSignupRoutes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatProgressSpinnerModule,
        FuseCardModule,
        FuseAlertModule,
        SharedModule
    ]
})
export class AuthStudentsignUpModule { }
