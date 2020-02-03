import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPage } from './tabs.page';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{
        path: '',
        component: TabsPage,
        children: [
            {
                path: 'overview',
                loadChildren: () => 
                    import('./overview/overview.module').then(m => m.OverviewPageModule)
            },
            {
                path: 'studies',
                loadChildren: () =>
                    import('./related-studies/related-studies.module').then(m => m.RelatedStudiesPageModule)
            },
            {
                path: 'series',
                loadChildren: () => 
                    import('./series/series.module').then(m => m.SeriesPageModule)
            },
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'overview'
            }
        ]
    }])
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
