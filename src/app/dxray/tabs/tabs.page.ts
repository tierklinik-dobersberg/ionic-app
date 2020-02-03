import { Component, OnInit, OnDestroy } from '@angular/core';
import { StudyService } from './study.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  providers: [StudyService]
})
export class TabsPage implements OnInit, OnDestroy {
  study: any | null = null;

  private subscription: Subscription = Subscription.EMPTY;
  
  constructor(private studyService: StudyService) {}
              
  ngOnInit() {
    this.subscription = this.studyService.onStudy().subscribe(study => {
        this.study = study;
    })
  }
  
  ngOnDestroy() {
      this.subscription.unsubscribe();
  }
}
