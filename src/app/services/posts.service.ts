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

import { Plugins } from '@capacitor/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
const { Share } = Plugins;

@Injectable({
    providedIn: 'root'
})
export class PostsService {

    myUserID: string;
    myPosts = new BehaviorSubject<Array<any>>([]);

    get timestamp() {
        return firebase.firestore.FieldValue.serverTimestamp();
    }

    private LANG_TRANSLATIONS: any;

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
        private router: Router,
        private uploadService: FireStorageUploadService,
        private translate: TranslateService
    ) {

        this.fetchLangTexts();
        this.translate.onLangChange.subscribe(() => {
            this.fetchLangTexts();
        })

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

    private fetchLangTexts() {
        this.translate.get(['Alert', 'Edit', 'PROFILE_UPDATE_REQUIRED', 'Ok', 'Cancel', "Share",
            "REPORT_THIS_AD", "Delete", "Options", "PENDING_FOR_ADMIN", "DELETE_CONFIRM",
            "Confirm", "Yes", "No", "INVITE_HEADER", "INVITE_MESSAGE", "APP_TITLE", "POST_SHARE_MESSAGE",
        "RATE_ALERT_HEADER", "RATE_ALERT_MESSAGE", "NO_THANKS", "RATE_NOW"]).pipe(take(1)).subscribe((translations: string) => {
                this.LANG_TRANSLATIONS = translations;
            });
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

    async amIEligible() {
        let mySelf = await this.profileService.profile.pipe(take(1)).toPromise();

        if (!!!mySelf?.displayName) {

            const alert = await this.alertController.create({
                cssClass: 'my-custom-class',
                header: this.LANG_TRANSLATIONS.Alert,
                message: this.LANG_TRANSLATIONS.PROFILE_UPDATE_REQUIRED,
                buttons: [
                    {
                        text: this.LANG_TRANSLATIONS.Cancel,
                        role: 'cancel',
                        handler: () => { }
                    }, {
                        text: this.LANG_TRANSLATIONS.Ok,
                        handler: () => {
                            this.profileService.editProfile();
                        }
                    }
                ]
            });

            await alert.present();

            return false;
        }

        return true;
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

            Share.share({
                title: this.LANG_TRANSLATIONS.APP_TITLE,
                text: this.LANG_TRANSLATIONS.POST_SHARE_MESSAGE,
                url: `https://archakaads.app/${post.id}`,
                dialogTitle: 'Share this Ad...'
            }).then(() => { }).catch(err => this.toast.error(err));

        }
    }

    async shareThisApp() {
        await Share.share({
            title: this.LANG_TRANSLATIONS.INVITE_HEADER,
            text: this.LANG_TRANSLATIONS.INVITE_MESSAGE,
            url: 'https://play.google.com/store/apps/details?id=net.srivaikhanasa.archakaads',
            dialogTitle: 'Invite Others'
        });
    }

    async rateThisApp() {
        const alert = await this.alertController.create({
            cssClass: 'my-custom-class',
            header: this.LANG_TRANSLATIONS.RATE_ALERT_HEADER,
            message: this.LANG_TRANSLATIONS.RATE_ALERT_MESSAGE,
            buttons: [
                {
                    text: this.LANG_TRANSLATIONS.NO_THANKS,
                    role: 'cancel',
                    handler: () => { }
                }, {
                    text: this.LANG_TRANSLATIONS.RATE_NOW,
                    handler: () => {
                        Plugins.CapacitorRateApp.requestReview();
                    }
                }
            ]
        });

        await alert.present();
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

        if (!!!await this.amIEligible()) return;

        if (!post.isVerified) {
            const alert = await this.alertController.create({
                header: this.LANG_TRANSLATIONS.Alert,
                message: this.LANG_TRANSLATIONS.PENDING_FOR_ADMIN,
                buttons: [this.LANG_TRANSLATIONS.Ok]
            });

            await alert.present();
            return;
        }

        const buttons = [];

        let mySelf = await this.profileService.profile.pipe(take(1)).toPromise();



        if (post.ownerId === mySelf.id) {
            buttons.push({
                text: this.LANG_TRANSLATIONS.Edit,
                icon: 'assets/icons/edit.svg',
                handler: () => { this.edit(post); }
            });
            buttons.push({
                text: this.LANG_TRANSLATIONS.Delete,
                icon: 'assets/icons/delete.svg',
                cssClass: 'dangerbutton',
                handler: () => { this.delete(post); }
            });
            buttons.push({
                text: this.LANG_TRANSLATIONS.Share,
                icon: 'assets/icons/share.svg',
                handler: () => { this.shareThisPost(post); }
            });
        }
        else {
            buttons.push({
                text: this.LANG_TRANSLATIONS.Share,
                icon: 'assets/icons/share.svg',
                handler: () => { this.shareThisPost(post); }
            });
            buttons.push({
                text: this.LANG_TRANSLATIONS.REPORT_THIS_AD,
                icon: 'assets/icons/abuse.svg',
                cssClass: 'dangerbutton',
                handler: async () => { this.reportAbuse(post); }
            });
        }

        const actionSheet = await this.actionSheetController.create({
            header: this.LANG_TRANSLATIONS.Options,
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
            header: this.LANG_TRANSLATIONS.Confirm,
            message: this.LANG_TRANSLATIONS.DELETE_CONFIRM,
            buttons: [
                {
                    text: this.LANG_TRANSLATIONS.No,
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => { }
                }, {
                    text: this.LANG_TRANSLATIONS.Yes,
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
                    pageTitle: this.LANG_TRANSLATIONS.REPORT_THIS_AD
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

        if (!!!await this.amIEligible()) return;

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
