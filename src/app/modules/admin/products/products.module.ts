import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full'
  },
  {
    path     : 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListModule)
  },
  {
    path     : 'create',
    loadChildren: () => import('./create/create.module').then(m => m.CreateModule)
  },
  {
    path     : 'conversions',
    loadChildren: () => import('./conversions/conversions.module').then(m => m.ConversionsModule)
  }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ]
})
export class ProductsModule { }
