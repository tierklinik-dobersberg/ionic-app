import { Component, OnInit } from '@angular/core';
import { StudyService } from '../study.service';
import { DxrService } from 'src/app/dxr.service';
import { filter, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-related-studies',
  templateUrl: './related-studies.page.html',
  styleUrls: ['./related-studies.page.scss'],
})
export class RelatedStudiesPage implements OnInit {
    get study(): any | null {
        return this.studyService.study;
    }
  
    allVisits: any[] = null;
    
    constructor(private studyService: StudyService,
                private dxr: DxrService) { }
  
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
