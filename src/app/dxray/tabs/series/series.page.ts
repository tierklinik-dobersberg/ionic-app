import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudyService } from '../study.service';
import { DxrService } from 'src/app/dxr.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-series',
    templateUrl: './series.page.html',
    styleUrls: ['./series.page.scss'],
})
export class SeriesPage implements OnInit, OnDestroy {
    private studySubscription: Subscription = Subscription.EMPTY;
    
    study: any| null = null;
    readonly getUrl = this.studyService.getThumbnailUrl;

    constructor(private studyService: StudyService,
                private dxr: DxrService) {}
                
    ngOnInit() {
        this.studySubscription = this.studyService.onStudy()
            .subscribe((study) => {
                this.study = study;
            }); 
    }

    ngOnDestroy() {
        this.studySubscription.unsubscribe();
    }
}