import { Component, OnInit } from '@angular/core';
import * as AuthN from 'keratin-authn';
import { Router } from '@angular/router';
import { LoadingController, AlertController } from '@ionic/angular';
import { isArray } from 'util';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: string = '';
  password: string = '';
  loginDisabled: boolean = false;

  constructor(private router: Router,
              private alertController: AlertController,
              private loadingController: LoadingController) {}

  ngOnInit() {
      // try to import the a session
      // this is also done when the application it self is initialized
      // but we must ensure to redirect away from the login page if
      // directly targeted by the user
      AuthN.restoreSession()
        .then(() => this.router.navigate(['']))
        .catch(() => {
            console.log(`No valid user session found`);
        })
  }

  /**
   * Try to create a new user session and redirect the user
   * to the main application page if successful
   */
  async login() {
    const loading = await this.loadingController.create({
        message: 'Anmelden',
    });
    this.loginDisabled = true;
    
    try {
        await loading.present();

        await AuthN.login({
            username: this.username, 
            password: this.password
        });

        this.router.navigate(['']);
    }
    catch(err) {
       this.showErrorAlert(err); 
    }
    finally {
        loading.dismiss();
    }
  }

  /**
   * Inspects an error occured while creating a user session and
   * displays an appropriate alert box.
   *
   * Note: Re-enables the login-button once the alert box is closed
   * 
   * @param err - The error that occured while creating a session
   */
  private showErrorAlert(err: any) {
    const invalid = !!err
    && isArray(err)
    && err.some(e => e.field == "credentials");

    let message = 'Falscher Benutzername oder Password!';

    if (!invalid) {
        if (isArray(err)) {
            const messages = err.map(e => {
                if (!e.field) {
                    return e.message;
                }
                return `${e.field}: ${e.message}`;
            })
            
            message = messages.join('; ')
        } else {
            // if we don't know what happened we'll try to JSON marshal the
            // error and display that ...
            message = JSON.stringify(err, undefined, ' ');
        }
    }

    this.alertController.create({
        message: message,
        buttons: ['OK']
    })
        .then(alert => alert.present())
        .then(() => this.loginDisabled = false);
  }
}
