import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from 'src/app/shared/shared.module';
import { SeriesPageRoutingModule } from './series-routing.module';
import { SeriesPage } from './series.page';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        SharedModule,
        SeriesPageRoutingModule,
    ],
    declarations: [
        SeriesPage
    ],
    exports: [
        SeriesPage
    ]
})
export class SeriesPageModule {}
