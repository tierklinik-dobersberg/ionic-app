import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { SessionGuard } from './session.guard';

const routes: Routes = [
  {
    path: 'xray',
    canActivate: [SessionGuard],
    loadChildren: () => import('./dxray/study-list/study-list.module').then(m => m.StudyListPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'profile',
    canActivate: [SessionGuard],
    loadChildren: () => import('./profile/profile.module').then( m => m.ProfilePageModule)
  },
  {
    path: 'overview',
    loadChildren: () => import('./dxray/tabs/overview/overview.module').then( m => m.OverviewPageModule)
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'xray'
  },
  {
    path: 'related-studies',
    loadChildren: () => import('./dxray/tabs/related-studies/related-studies.module').then( m => m.RelatedStudiesPageModule)
  },
  {
    path: 'viewer/:studyID/:seriesID/:instanceID',
    loadChildren: () => import('./dwv/dwv.module').then( m => m.DwvPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
