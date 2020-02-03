import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RelatedStudiesPageRoutingModule } from './related-studies-routing.module';

import { RelatedStudiesPage } from './related-studies.page';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RelatedStudiesPageRoutingModule
  ],
  declarations: [RelatedStudiesPage]
})
export class RelatedStudiesPageModule {}
