import '@angular/compiler';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as AuthN from 'keratin-authn';

AuthN.setHost(environment.authServer);
AuthN.setLocalStorageStore('authnSessionToken');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule, { ngZoneEventCoalescing: true })
  .catch(err => console.log(err));
