import { Injectable } from '@angular/core';
import { ArchakaPostViewComponent } from '../archaka-post-view/archaka-post-view.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { NativeFirebasePushNotificationService } from '@acharyarajasekhar/ion-native-services';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';
import { ModalController, Platform } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    listOfNotifications: Array<any> = [];

    constructor(
        private platform: Platform,
        private store: AngularFirestore,
        private authService: AuthService,
        private toast: ToastService,
        private modalController: ModalController,
        private nativeFirebasePushNotificationService: NativeFirebasePushNotificationService,
    ) {

        this.nativeFirebasePushNotificationService.init();

        this.nativeFirebasePushNotificationService.pushNotificationActionPerformed.subscribe(notification => {
            if (!!notification && !!notification.notification && !!notification.notification.data && notification.notification.data.type === 'archakaad') {
                const notifi = JSON.parse(JSON.stringify(notification));
                this.openPost(notifi.notification.data.id);
            }
        });

        this.nativeFirebasePushNotificationService.pushNotificationReceived.subscribe(notification => {
            // alert("Received: " + JSON.stringify(notification));    
            // this.toast.show("New notification received...");
        });

        this.authService.user.subscribe(u => {
            if (!!u && !!u.uid) {
                this.store.collection('notifications', q => q.where('userId', '==', u.uid)).snapshotChanges()
                    .pipe(map(actions => actions.map(this.documentToDomainObject))).subscribe(notifications => {
                        this.listOfNotifications = notifications;
                    })
            }
        })
    }

    openPost(archakaAdId) {
        this.platform.ready().then(async () => {
            setTimeout(async () => {
                const modal = await this.modalController.create({
                    component: ArchakaPostViewComponent,
                    componentProps: {
                        id: archakaAdId
                    }
                });
                await modal.present();
            }, 500)
        });
    }

    init() { }

    documentToDomainObject = _ => {
        const object = _.payload.doc.data();
        object.id = _.payload.doc.id;
        return object;
    }

    deleteOne(id: any) {
        return this.store.collection('notifications').doc(id).delete();
    }

    clearAll() {
        let temp = JSON.parse(JSON.stringify(this.listOfNotifications));
        _.forEach(temp, async (item) => {
            await this.deleteOne(item.id);
        })
    }

    setAllAsRed() {
        let temp = JSON.parse(JSON.stringify(this.listOfNotifications));
        _.forEach(temp, async (item) => {
            await this.store.collection('notifications').doc(item.id).set({ isNew: false }, { merge: true });
        })
    }

    public getCount() {
        return _.filter(this.listOfNotifications, function (o) { if (!!o.isNew) return o }).length || 0;
    }

}