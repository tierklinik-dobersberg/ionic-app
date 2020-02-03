import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as AuthN from 'keratin-authn';
import { Router } from '@angular/router';
import { SessionGuard } from './session.guard';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
	private platform: Platform,
	private splashScreen: SplashScreen,
	private statusBar: StatusBar,
	private router: Router,
	private sessionGuard: SessionGuard,
  ) {
	this.initializeApp();
  }

  initializeApp() {
	this.platform.ready().then(() => {
	  this.statusBar.styleDefault();
	  
      this.sessionGuard.session
        .then(session => {
            if (!session) {
                this.router.navigate(['/login'])
            }
        })

	  this.splashScreen.hide();
	});
  }
}
