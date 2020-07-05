import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, } from 'rxjs';
import * as firebase from 'firebase/app';
import { FireStorageUploadService, ToastService } from '@acharyarajasekhar/ngx-utility-services';
import { environment } from 'src/environments/environment';
import { PopoverController, ModalController, AlertController } from '@ionic/angular';
import { ProfilePopupCardComponent } from '../profile/profile-popup-card/profile-popup-card.component';
import { ProfileEditorComponent } from '../profile/profile-editor/profile-editor.component';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import { take } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profile = new BehaviorSubject<any>(undefined);
  myUserID: string;

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  private LANG_TRANSLATIONS: any;

  constructor(
    private authService: AuthService,
    private store: AngularFirestore,
    private toast: ToastService,
    private busy: BusyIndicatorService,
    private modalController: ModalController,
    private uploadService: FireStorageUploadService,
    private popoverController: PopoverController,
    private alertController: AlertController,
    private translate: TranslateService
  ) {

    this.fetchLangTexts();
    this.translate.onLangChange.subscribe(() => {
        this.fetchLangTexts();
    })

    this.authService.authState.subscribe(u => {
      if (!!u && !!u.uid) {
        this.myUserID = u.uid;
        this.store.collection('users').doc(u.uid).valueChanges().pipe(take(1)).subscribe((profileData: any) => {
          if (!!!profileData.displayName) {

            this.alertController.create({
              cssClass: 'my-custom-class',
              header: this.LANG_TRANSLATIONS.Alert,
              message: this.LANG_TRANSLATIONS.PROFILE_UPDATE_ALERT,
              buttons: [
                {
                  text: this.LANG_TRANSLATIONS.Cancel,
                  role: 'cancel',
                  handler: () => { }
                }, {
                  text: this.LANG_TRANSLATIONS.Ok,
                  handler: async () => {
                    await this.editProfile();
                  }
                }
              ]
            }).then(alert => {
              alert.present();
            });

          }
        })
        this.store.collection('users').doc(u.uid).valueChanges().subscribe(profileData => {
          this.profile.next(profileData);
        })
      }
      else {
        this.myUserID = null;
        this.profile.next(undefined);
      }
    })
  }

  private fetchLangTexts() {
    this.translate.get(['Alert', 'Edit', 'PROFILE_UPDATE_ALERT', 'Ok', 'Cancel']).pipe(take(1)).subscribe((translations: string) => {
      this.LANG_TRANSLATIONS = translations;
    });
  }

  getUserProfileById(id: string) {
    return this.store.collection('users').doc(id).valueChanges();
  }

  uploadProfileAvatar(photoURL) {
    return new Promise((res, rej) => {
      if (!!photoURL && !photoURL.includes(environment.defaults.fireStorageBucketName)) {
        const fileName = `images/users/${this.myUserID}_avatar.jpg`;
        this.uploadService.uploadSingle(photoURL, fileName).then((downloadPhotoURL) => {
          res(downloadPhotoURL);
        }).catch(err => rej(err));
      }
      else {
        res(photoURL);
      }
    });
  }

  uploadCoverPhoto(coverPhotoURL) {
    return new Promise((res, rej) => {
      if (!!coverPhotoURL && !coverPhotoURL.includes(environment.defaults.fireStorageBucketName)) {
        const fileName = `images/users/${this.myUserID}_cover.jpg`;
        this.uploadService.uploadSingle(coverPhotoURL, fileName).then((downloadPhotoURL) => {
          res(downloadPhotoURL);
        }).catch(err => rej(err));
      }
      else {
        res(coverPhotoURL);
      }
    });
  }

  updateProfile(data: any) {

    return new Promise((res, rej) => {
      this.uploadProfileAvatar(data.photoURL).then(photoURL => {
        data.photoURL = photoURL;
        this.uploadCoverPhoto(data.coverPhotoURL).then(coverPhotoURL => {
          data.coverPhotoURL = coverPhotoURL;
          data.updatedAt = this.timestamp;
          this.store
            .collection('users')
            .doc(this.myUserID)
            .set(data, { merge: true })
            .then(() => res())
            .catch(err => rej(err));
        }).catch(err => rej(err))
      }).catch(err => rej(err))
    });

  }

  async showThisProfile(profile: any) {
    const popover = await this.popoverController.create({
      component: ProfilePopupCardComponent,
      componentProps: {
        profile: profile
      }
    });

    await popover.present();
  }

  async editProfile() {

    let mySelf = await this.profile.pipe(take(1)).toPromise();

    const modal = await this.modalController.create({
      component: ProfileEditorComponent,
      componentProps: {
        profile: mySelf
      }
    });

    modal.onDidDismiss().then(result => {
      if (result.role === 'ok') {
        if (!!result.data) {

          this.busy.show();

          mySelf = {
            ...mySelf,
            ...result.data
          }

          this.updateProfile(mySelf).then(() => {
            this.toast.show("Profile updated successfully...");
            this.busy.hide();
          }).catch(err => {
            console.log(err);
            this.toast.error(err);
            this.busy.hide();
          });

        }
      }
    })

    return await modal.present();
  }

}
