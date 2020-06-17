import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import { NativeFirebasePushNotificationService } from '@acharyarajasekhar/ion-native-services';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<any>(null);
  authState: Observable<firebase.User>;
  userClaims = new BehaviorSubject<any>({});

  userNotificationTopic: string = 'userchannel';
  adminNotificationTopic: string = 'adminchannel';

  constructor(
    private platform: Platform,
    private fireAuth: AngularFireAuth,
    private nativeFirebasePushNotificationService: NativeFirebasePushNotificationService,
    private busyIndicatorService: BusyIndicatorService,
    private router: Router) {

    this.nativeFirebasePushNotificationService.init();

    this.authState = this.fireAuth.authState;
    this.authState.subscribe(u => {

      if (!!u && !!u.uid) {
        if (this.platform.is('mobile')) {
          this.nativeFirebasePushNotificationService.subscribeToTopic(this.userNotificationTopic)
            .then(() => console.log('subscribed to topic: ' + this.userNotificationTopic))
            .catch(err => console.log('ERROR while subscribing to topic: ' + this.userNotificationTopic));
        }

        this.fireAuth.currentUser.then(cu => {
          cu.getIdTokenResult(true)
            .then((res: any) => {
              this.userClaims.next(res.claims);
              if (!!res.claims.admin) {
                if (this.platform.is('mobile')) {
                  this.nativeFirebasePushNotificationService.subscribeToTopic(this.adminNotificationTopic)
                    .then(() => console.log('subscribed to topic: ' + this.adminNotificationTopic))
                    .catch(err => console.log('ERROR while subscribing to topic: ' + this.adminNotificationTopic));
                }
              }
            })
        });
      }
      else {
        if (this.platform.is('mobile')) {
          this.nativeFirebasePushNotificationService.unsubscribeFromTopic(this.userNotificationTopic)
            .then(() => console.log('unsubscribed to topic: ' + this.userNotificationTopic))
            .catch(err => console.log('ERROR while unsubscribing to topic: ' + this.userNotificationTopic));

          this.nativeFirebasePushNotificationService.unsubscribeFromTopic(this.adminNotificationTopic)
            .then(() => console.log('unsubscribed to topic: ' + this.adminNotificationTopic))
            .catch(err => console.log('ERROR while unsubscribing to topic: ' + this.adminNotificationTopic));
        }
      }

      this.user.next(u)
    });

  }

  async logout() {
    await this.busyIndicatorService.show();
    this.fireAuth.signOut().then(() => {
      this.busyIndicatorService.hide();
      this.router.navigate(['/login']);
    })
  }

}
