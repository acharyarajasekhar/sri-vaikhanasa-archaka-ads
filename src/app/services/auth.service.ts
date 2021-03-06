import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import { NativeFirebasePushNotificationService, NativeFirebaseAuthService } from '@acharyarajasekhar/ion-native-services';
import { Platform, AlertController } from '@ionic/angular';
import { AngularFirestore } from '@angular/fire/firestore';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<any>(null);
  authState: Observable<firebase.User>;
  userClaims = new BehaviorSubject<any>({});

  userNotificationTopic: string = 'userchannel';
  adminNotificationTopic: string = 'adminchannel';

  private LANG_TRANSLATIONS: any;

  constructor(
    private platform: Platform,
    private fireAuth: AngularFireAuth,
    private nativeFirebasePushNotificationService: NativeFirebasePushNotificationService,
    private busy: BusyIndicatorService,
    private store: AngularFirestore,
    private alertController: AlertController,
    private nativeFirebaseAuthService: NativeFirebaseAuthService,
    private router: Router,
    private translate: TranslateService
  ) {

    this.fetchLangTexts();
    this.translate.onLangChange.subscribe(() => {
      this.fetchLangTexts();
    })

    this.authState = this.fireAuth.authState;
    this.authState.subscribe(u => {

      if (!!u && !!u.uid) {
        if (this.platform.is('mobile')) {
          this.nativeFirebasePushNotificationService.registration.asObservable().subscribe(token => {
            if (!!token) {
              this.store.collection('fcm').doc(u.uid).set({
                fcmToken: token,
                userId: u.uid
              })
            }
          });

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

  private fetchLangTexts() {
    this.translate.get(['Confirm', 'Edit', 'LOGOUT_CONFIRM', 'Ok', 'Cancel']).pipe(take(1)).subscribe((translations: string) => {
      this.LANG_TRANSLATIONS = translations;
    });
  }

  async logout() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: this.LANG_TRANSLATIONS.Confirm,
      message: this.LANG_TRANSLATIONS.LOGOUT_CONFIRM,
      buttons: [
        {
          text: this.LANG_TRANSLATIONS.Cancel,
          role: 'cancel',
          handler: () => { }
        }, {
          text: this.LANG_TRANSLATIONS.Ok,
          handler: async () => {
            await this.busy.show();
            this.nativeFirebaseAuthService.singOut().pipe(take(1)).subscribe(() => {
              this.busy.hide();
              this.router.navigate(['/login']);
              navigator['app'].exitApp(); // Exit app
            });
          }
        }
      ]
    });

    await alert.present();

  }

}
