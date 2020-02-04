import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DwvPageRoutingModule } from './dwv-routing.module';

import { DwvPage } from './dwv.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DwvPageRoutingModule
  ],
  declarations: [DwvPage]
})
export class DwvPageModule {}
