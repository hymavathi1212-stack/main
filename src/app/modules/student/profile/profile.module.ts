import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { Route, RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { SharedModule } from 'app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatLuxonDateModule } from '@angular/material-luxon-adapter';
import { FuseAlertModule } from '@fuse/components/alert';
import { FuseConfirmationModule } from '@fuse/services/confirmation';
import { ProfileComponent } from './profile/profile.component';
import { FuseCardModule } from "../../../../@fuse/components/card/card.module";
import { HttpClientJsonpModule, HttpClientModule } from '@angular/common/http';
const routes: Routes = [{
  path: '', component: ProfileComponent
 },
];



@NgModule({
    declarations: [
        ProfileComponent
    ],
    imports: [
        CommonModule,
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        MatStepperModule,
        MatDatepickerModule,
        MatLuxonDateModule,
        FuseAlertModule,
        SharedModule,
        FuseConfirmationModule,
        RouterModule.forChild(routes),
        FuseCardModule,
        HttpClientModule
    ]
})
export class ProfileModule { }
