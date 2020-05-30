import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { BehaviorSubject, } from 'rxjs';
import * as firebase from 'firebase/app';
import { FireStorageUploadService } from '@acharyarajasekhar/ngx-utility-services';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  profile = new BehaviorSubject<any>(undefined);
  myUserID: string;

  get timestamp() {
    return firebase.firestore.FieldValue.serverTimestamp();
  }

  constructor(
    private authService: AuthService,
    private store: AngularFirestore,
    private uploadService: FireStorageUploadService
  ) {
    this.authService.authState.subscribe(u => {
      if (!!u && !!u.uid) {
        this.myUserID = u.uid;
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
}
