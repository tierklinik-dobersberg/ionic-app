import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import * as AuthN from 'keratin-authn';
import { Router } from '@angular/router';

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
  ) {
	this.initializeApp();
  }

  initializeApp() {
	this.platform.ready().then(() => {
	  this.statusBar.styleDefault();
	  
	  AuthN.importSession()
		.then(() => console.log(`Found valid user session: ${AuthN.session()}`))
		.catch(() => this.router.navigate(['/login']));

	  this.splashScreen.hide();
	});
  }
}
