import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { DwvPageRoutingModule } from './dwv-routing.module';
import { DwvPage } from './dwv.page';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DwvPageRoutingModule,
    SharedModule
  ],
  declarations: [DwvPage]
})
export class DwvPageModule {}
