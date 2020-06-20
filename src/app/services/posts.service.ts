import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs';
import { FireStorageUploadService, ToastService } from '@acharyarajasekhar/ngx-utility-services';
import { environment } from 'src/environments/environment';
import { ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { NgxGenericFormComponent, NgxGenericFormService } from '@acharyarajasekhar/ngx-generic-form';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import { take } from 'rxjs/operators';
import { ProfileService } from './profile.service';
import { ArchakaPostEditorComponent } from '../archaka-post-editor/archaka-post-editor.component';
import { ArchakaPostViewComponent } from '../archaka-post-view/archaka-post-view.component';
import { NativeSocialSharingService, SocialSharingContent } from '@acharyarajasekhar/ion-native-services';

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
        private busy: BusyIndicatorService,
        private alertController: AlertController,
        private modalController: ModalController,
        private actionSheetController: ActionSheetController,
        private ngxGenericFormService: NgxGenericFormService,
        private profileService: ProfileService,
        private toast: ToastService,
        private nativeSocialSharingService: NativeSocialSharingService,
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

    getPostById(id: string) {
        return this.store.collection('archakaposts').doc(id).valueChanges();
    }

    shareThisPost(post: any) {
        if (!!post && post.id) {

            let message: SocialSharingContent = {
                message: `Archaka required for '${post.name}' and monthly salary is ${post.salary}. For more details install 'Archaka Ads' app from Google Play Store..`,
                subject: 'Archaka Ads',
                url: `https://archakaads.app/${post.id}`
            };

            this.nativeSocialSharingService.share(message).then(() => { }).catch(err => this.toast.error(err));

        }
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

    async showPostOptions(post: any) {

        if (!post.isVerified) return;

        const buttons = [];

        let mySelf = await this.profileService.profile.pipe(take(1)).toPromise();



        if (post.ownerId === mySelf.id) {
            buttons.push({
                text: 'Edit',
                icon: 'assets/icons/edit.svg',
                handler: () => { this.edit(post); }
            });
            buttons.push({
                text: 'Delete',
                icon: 'assets/icons/delete.svg',
                cssClass: 'dangerbutton',
                handler: () => { this.delete(post); }
            });
            buttons.push({
                text: 'Share',
                icon: 'assets/icons/share.svg',
                handler: () => { this.shareThisPost(post); }
            });
        }
        else {
            buttons.push({
                text: 'Share',
                icon: 'assets/icons/share.svg',
                handler: () => { this.shareThisPost(post); }
            });
            buttons.push({
                text: 'Report this Ad...',
                icon: 'assets/icons/abuse.svg',
                cssClass: 'dangerbutton',
                handler: async () => { this.reportAbuse(post); }
            });
        }

        const actionSheet = await this.actionSheetController.create({
            header: 'Options',
            buttons: buttons
        });

        await actionSheet.present();

    }

    private handleUndefined = (obj) => {
        Object.keys(obj).forEach(key => {
            if (obj[key] && typeof obj[key] === 'object') this.handleUndefined(obj[key]);
            else if (obj[key] === undefined) obj[key] = null;
        });
        return obj;
    };

    async delete(post) {

        const alert = await this.alertController.create({
            header: 'Confirm!',
            message: 'Do you really want to <strong>DELETE</strong> this Ad ?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => { }
                }, {
                    text: 'Yes',
                    handler: async () => {
                        this.busy.show();
                        this.deleteMyPostById(post.id).then(() => {
                            this.busy.hide();
                            this.toast.show("Ad is deleted");
                        }).catch(err => {
                            this.busy.hide();
                            this.toast.error(err);
                        });
                    }
                }
            ]
        });

        await alert.present();

    }

    async edit(post) {
        if (!!post && !!post.id) {

            const modal = await this.modalController.create({
                component: ArchakaPostEditorComponent,
                componentProps: {
                    post: post,
                    pageTitle: "Edit Ad..."
                }
            });

            modal.onDidDismiss().then(result => {
                if (result.role === 'ok') {
                    if (!!result.data) {

                        this.busy.show();

                        this.addOrUpdatePost(result.data).then(() => {
                            this.toast.show("Ad updated successfully...");
                            this.busy.hide();
                        }).catch(err => {
                            this.toast.error(err);
                            this.busy.hide();
                        });

                    } ``
                }
            })

            return await modal.present();

        }
    }

    async reportAbuse(post: any) {

        if (!!post && !!post.id) {

            const modal = await this.modalController.create({
                component: NgxGenericFormComponent,
                componentProps: {
                    formConfig: environment.formConfigs.reportAbuseForm,
                    pageTitle: "Report this Ad..."
                }
            });

            modal.onDidDismiss().then(async result => {
                if (result.role === 'ok') {
                    if (!!result.data) {

                        this.busy.show();

                        let mySelf = await this.profileService.profile.pipe(take(1)).toPromise();

                        if (!!mySelf) {

                            try {
                                if (!!result.data.isHidden) {
                                    await this.hideThisPost(post.id);
                                }

                                let reportInfo = {
                                    subject: post,
                                    reportedInfo: result.data,
                                    reportedBy: mySelf,
                                    reportedAt: this.timestamp
                                }

                                this.handleUndefined(reportInfo);

                                await this.ngxGenericFormService.report('reportabuse', reportInfo);
                                this.toast.show("Your information is submitted...");
                            }
                            catch (err) {
                                this.toast.error(err);

                            }
                        }
                        this.busy.hide();
                    }
                }
            })

            return await modal.present();

        }
    }

    async writeFeedback() {

        const modal = await this.modalController.create({
            component: NgxGenericFormComponent,
            componentProps: {
                formConfig: environment.formConfigs.feedbackForm,
                pageTitle: "Feedback Form...",
                headerColor: 'primary',
                contentColor: 'secondary'
            }
        });

        modal.onDidDismiss().then(async result => {
            if (result.role === 'ok') {
                if (!!result.data) {

                    this.busy.show();

                    let mySelf = await this.profileService.profile.pipe(take(1)).toPromise();

                    if (!!mySelf) {

                        try {

                            let reportInfo = {
                                feedbackInfo: result.data,
                                providedBy: mySelf,
                                providedAt: this.timestamp
                            }

                            this.handleUndefined(reportInfo);

                            await this.ngxGenericFormService.report('feedbacks', reportInfo);
                            this.toast.show("Your information is saved...");
                            this.busy.hide();
                        }
                        catch (err) {
                            this.toast.error(err);
                            this.busy.hide();
                        }
                    }

                }
            }
        })

        return await modal.present();

    }

    async addNew() {
        const modal = await this.modalController.create({
            component: ArchakaPostEditorComponent
        });

        modal.onDidDismiss().then(result => {
            if (result.role === 'ok') {
                if (!!result.data) {

                    this.busy.show();

                    this.addOrUpdatePost(result.data).then(() => {
                        this.toast.show("Ad updated successfully...");
                        this.busy.hide();
                    }).catch(err => {
                        this.toast.error(err);
                        this.busy.hide();
                    });

                }
            }
        })

        return await modal.present();
    }

}
