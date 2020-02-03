import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';

import * as AuthN from 'keratin-authn';
import { Router } from '@angular/router';
import { ActionSheetController, AlertController, IonSearchbar } from '@ionic/angular';
import { DxrService } from 'src/app/dxr.service';
import { environment } from 'src/environments/environment';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'tkd-xray-view',
  templateUrl: 'study-list.page.html',
  styleUrls: ['study-list.page.scss']
})
export class ViewPage implements OnInit {
  data: (any[] | null) = null;
  showSearchBar = false;
  searchText = '';

  @ViewChild('searchBar', {read: IonSearchbar, static: true})
  searchBar: IonSearchbar;

  constructor(private router: Router,
              private dxr: DxrService,
              private alertController: AlertController,
              private actionSheetController: ActionSheetController) {}

  ngOnInit() {
      this.loadMore()
  }

  @HostListener('keyup', ['$event'])
  checkAbortSearch(event: KeyboardEvent) {
      if (event.key === "Escape" && this.showSearchBar) {
          this.toggleSearch();
          event.preventDefault();
      }
  }

  toggleSearch() {
      this.showSearchBar = !this.showSearchBar;
      this.searchText = '';
      if (!this.showSearchBar) {
          this.loadMore(undefined, true);
      } else {
          this.data = [];
          this.searchBar.setFocus();
      }
  }

  searchStudies(search: string) {
    this.dxr.search(search)
        .subscribe({
            next: data => this.handleStudies(data),
            error: err => this.handleError(err),
        })
  }

  loadMore(event?: CustomEvent, refresh?: boolean) {
    let offset = (this.data && this.data.length) || 0;
    
    if (!!refresh) {
        offset = 0;
    }

    this.dxr.loadLastStudies(offset, 10)
    .subscribe({
        next: data => this.handleStudies(data, offset, event),
        error: err => this.handleError(err, event, refresh), 
    });
  }

  trackStudy(_: number, study: any) {
      return study.studyInstanceUid;
  }

  /**
   * Perform a logout and redirect the user to the login page
   */
  logout() {
      AuthN.logout()
        .then(() => this.router.navigate(['login']));
  }

  async selectTool() {
    const sheet = await this.actionSheetController.create({
        header: 'Werkzeug',
        buttons: [
            {
                text: 'Lineal',
                icon: 'code-working',
            },
            {
                text: 'Winkel',
                icon: 'share',
            },
            {
                text: 'Beschriftung',
                icon: 'information-circle',
            },
            {
                text: 'Formen',
                icon: 'cellular'
            }
        ]
    })
    
    sheet.present();
  }

  private handleStudies(data: any[], offset = 0, event?: any) {
    data = data.map(item => {
        if (!!item.seriesList && !!item.seriesList[0].instances) {
            const wadoURI: string = item.seriesList[0].instances[0].url;
            const scheme = environment.dxrUrl.startsWith('http://') ? 'http://' : 'https://';
            const url = wadoURI.replace('dicomweb://', scheme) + '&contentType=image/jpeg';
            
            item.url = url;
        } else {
            console.warn(item);
        }
        return item;
    })
    
    if (offset === 0) {
        this.data = data;
    } else {
        this.data = [...this.data, ...data];
    }
    
    if (!!event) {
        (event.target as any).complete();
    }
  }

  private async handleError(err: any, event?: any, refresh?: boolean) {
    let message = 'Etwas ist schiefgelaufen, bitte versuchen Sie es später erneut.'
    if (err instanceof HttpErrorResponse) {
        if (err.status === 0 || err.status >= 500) {
            message = 'Server ist derzeit nicht erreichbar, bitte versuchen Sie es später erneut';
        } else {
            message = message + ' ' + err.message;
        }
    }

    // seems like a connection problem
    const alert = await this.alertController.create({
        header: 'Server Error',
        message: message,
        buttons: [{text: 'Erneut versuchen'}]
    });

    await alert.present();

    alert.onDidDismiss().then(() => {
        if (this.showSearchBar) {
            this.searchStudies(event);
        } else {
            this.loadMore(event, refresh);
        }
    })
  }
}
