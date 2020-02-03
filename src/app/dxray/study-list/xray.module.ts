import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ViewPage } from './study-list.page';

const routes: Routes = [
  {
    path: '',
    component: ViewPage,
  },
  {
      path: 'view/:studyID',
      loadChildren: () =>
          import('../tabs/tabs.module').then(m => m.TabsPageModule)
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class XrayPageRoutingModule {}
