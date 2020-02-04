import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DwvPage } from './dwv.page';

const routes: Routes = [
  {
    path: '',
    component: DwvPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DwvPageRoutingModule {}
