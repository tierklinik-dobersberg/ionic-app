import { Component, OnInit } from '@angular/core';
import { StudyService } from '../study.service';
import { DxrService } from 'src/app/dxr.service';
import { flatMap, filter } from 'rxjs/operators';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.page.html',
  styleUrls: ['./overview.page.scss'],
})
export class OverviewPage implements OnInit {
  get study(): any | null {
      return this.studyService.study;
  }

  readonly getUrl = this.studyService.getThumbnailUrl;
  readonly showSeries = this.platform.width() >= 576;

  allVisits: any[] = [];
  
  constructor(private studyService: StudyService,
              private dxr: DxrService,
              private platform: Platform) { }

  ngOnInit() {
      this.studyService.onStudy()
        .pipe(
            filter(study => !!study),
            flatMap(study => this.dxr.search(`id:${study.patientId}`)),
        )
        .subscribe({
            next: studies => {
                this.allVisits = studies.filter(study => study.studyInstanceUid !== this.study.studyInstanceUid);
            }
        }) 
  }

  getDescriptions(study: any) {
      if (!study || !study.seriesList) {
          return 'Keine Aufnahmen';
      }
      
      return study.seriesList.map(series => series.seriesDescription).join(', ')
  }
}
