import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RelatedStudiesPage } from './related-studies.page';

const routes: Routes = [
  {
    path: '',
    component: RelatedStudiesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RelatedStudiesPageRoutingModule {}
