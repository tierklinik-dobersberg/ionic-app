import {Injectable, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, BehaviorSubject } from 'rxjs';
import { DxrService } from 'src/app/dxr.service';
import { flatMap, map, share, publishLast, publishReplay, publishBehavior } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable()
export class StudyService implements OnDestroy {

    private _study: any;
    private study$: BehaviorSubject<any | null> = new BehaviorSubject(null);
    private subscription: Subscription = Subscription.EMPTY;
    
    get study(): any | null {
        return this._study
    }

    onStudy(): Observable<any> {
        return this.study$;
    }

    getThumbnailUrl = this.dxr.getThumbnailUrl;

    constructor(private activeRoute: ActivatedRoute,
                private dxr: DxrService) {

        this.subscription = this.activeRoute.paramMap.pipe(
            flatMap(params => this.dxr.loadStudy(params.get('studyID'))),
            map(result => {
                if (!result || !result.studies) {
                    return null;
                }
    
                return result.studies[0];
            })
        ).subscribe({
            next: value => {
                this._study = value;
                this.study$.next(value);
            }
        });
    }
    
    ngOnDestroy() {
        this.subscription.unsubscribe()
    }
}