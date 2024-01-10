import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AffliateProfileComponent } from './affliate-profile.component';

const routes: Routes = [{
  path: '', component: AffliateProfileComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AffliateProfileRoutingModule { }
