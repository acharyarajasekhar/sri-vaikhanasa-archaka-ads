import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { FireStorageUploadService } from '@acharyarajasekhar/ngx-utility-services';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    myUserID: string;
    myPosts = new BehaviorSubject<Array<any>>([]);

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
                this.store.collection('archakaposts', ref => ref.where('ownerId', '==', this.myUserID))
                    .valueChanges().subscribe(posts => {
                        this.myPosts.next(posts);
                    })
            }
            else {
                this.myUserID = null;
                this.myPosts.next([]);
            }
        })
    }

    uploadProfileAvatar(photos, id) {
        return new Promise((res, rej) => {
            if (!!photos && photos.length > 0 && !photos[0].includes(environment.defaults.fireStorageBucketName)) {
                const filePathPrefix = `images/archakaposts/${id}`;
                this.uploadService.uploadMultiple(photos, filePathPrefix).then((downloadPhotoURLs) => {
                    res(downloadPhotoURLs);
                }).catch(err => rej(err));
            }
            else {
                res(photos);
            }
        });
    }

    addOrUpdatePost(post: any) {

        if (!!!post.id) {
            let id = this.store.createId();
            post.id = id;
            post.isActive = true;
            post.isVerified = true;
            post.createdAt = this.timestamp;
        }

        post.ownerId = this.myUserID;
        post.updatedAt = this.timestamp;

        return new Promise((res, rej) => {
            this.uploadProfileAvatar(post.photos, post.id).then(photos => {
                post.photos = photos;
                this.store
                    .collection('archakaposts')
                    .doc(post.id)
                    .set(post, { merge: true })
                    .then(() => res())
                    .catch(err => rej(err));
            }).catch(err => rej(err))
        });

    }

    hideThisPost(postId: string) {

        return this.store
            .collection('archakaposts')
            .doc(postId)
            .set({ isVerified: false }, { merge: true });

    }

    deleteMyPostById(id: any) {
        return this.store.collection('archakaposts').doc(id).delete();
    }
}
