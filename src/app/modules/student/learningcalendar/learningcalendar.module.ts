import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LearningcalendarComponent } from './learningcalendar/learningcalendar.component';
import { RouterModule, Routes } from '@angular/router';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {CdkStepperModule} from '@angular/cdk/stepper';
const routes: Routes = [{
    path: '', component: LearningcalendarComponent
  }];

@NgModule({
  declarations: [
 
  ],
  imports: [
    CommonModule,
    MatStepperModule,
    MatIconModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    CdkStepperModule,
    
    
    RouterModule.forChild(routes),
  ]
})
export class LearningcalendarModule { }
