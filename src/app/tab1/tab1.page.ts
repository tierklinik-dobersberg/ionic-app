import { Component } from '@angular/core';

import * as AuthN from 'keratin-authn';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  constructor(private router: Router) {}
  
  /**
   * Perform a logout and redirect the user to the login page
   */
  logout() {
      AuthN.logout()
        .then(() => this.router.navigate(['login']));
  }
}
