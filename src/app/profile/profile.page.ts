import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../user.service';
import { Observable } from 'rxjs';
import { share, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AlertController } from '@ionic/angular';
import { SessionGuard } from '../session.guard';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user: Observable<User>;
  avatarUrl: Observable<string>;
  
  constructor(private userService: UserService,
              private sessionGuard: SessionGuard,
              private alertController: AlertController) { }

  ngOnInit() {
      this.user = this.userService.getProfile().pipe(share());
      this.avatarUrl = this.user.pipe(map(user => {
          return `${environment.iamServer}/v1/users/${user.accountID}/avatar`;
      }));
  }

  async logout() {
      const alert = await this.alertController.create({
        message: 'Möchtest du dich wirklich abmelden?',
        buttons: [
            {text: 'Ja, abmelden', handler: () => {
                this.sessionGuard.logout();
            }},
            {text: 'Nein'}
        ]
      });

      alert.present();
  }

  async editProfile() {
      const alert = await this.alertController.create({
          message: 'Diese Funktion ist noch nicht verfügbar. Bitte wende dich an den Administrator',
          buttons: [{text: 'OK'}]
      });
      
      alert.present();
  }
}
