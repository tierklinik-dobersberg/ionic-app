import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OverviewPageRoutingModule } from './overview-routing.module';

import { OverviewPage } from './overview.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeriesPageModule } from '../series/series.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    OverviewPageRoutingModule,
    SeriesPageModule,
  ],
  declarations: [OverviewPage]
})
export class OverviewPageModule {}
