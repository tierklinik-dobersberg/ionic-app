import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { ViewPage } from './study-list.page';
import { XrayPageRoutingModule } from './xray.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    XrayPageRoutingModule,
  ],
  declarations: [ViewPage]
})
export class StudyListPageModule {}
