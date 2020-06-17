import { Injectable } from '@angular/core';
import { NativeFirebasePushNotificationService } from '@acharyarajasekhar/ion-native-services';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';
import { ArchakaPostViewComponent } from '../archaka-post-view/archaka-post-view.component';
import { ModalController } from '@ionic/angular';

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    private listOfNotifications: Array<any> = [];
    public listOfNotifications$ = new BehaviorSubject<Array<any>>(this.listOfNotifications);

    constructor(
        private nativeFirebasePushNotificationService: NativeFirebasePushNotificationService,
        private toast: ToastService,
        private modalController: ModalController
    ) { }

    public init() {
        this.nativeFirebasePushNotificationService.pushNotificationActionPerformed.subscribe(notification => {
            alert(JSON.stringify(notification));
            if (!!notification) {
                setTimeout(async () => {
                    if (notification.notification.data.type === "archakaad") {
                        let id = notification.notification.data.id;
                        if (!!id) {
                            await this.openPost(id);
                        }
                    }
                }, 1000);
            }
        });

        this.nativeFirebasePushNotificationService.pushNotificationReceived.subscribe(notification => {
            this.listOfNotifications.push(notification);
            this.listOfNotifications$.next(this.listOfNotifications);
            this.toast.show("New Notification Received...");
        })
    }

    clearAll() {
        this.listOfNotifications = [];
        this.listOfNotifications$.next(this.listOfNotifications);
    }

    public getCount() {
        return this.listOfNotifications.length || 0;
    }

    async openPost(id: string) {
        const modal = await this.modalController.create({
            component: ArchakaPostViewComponent,
            componentProps: {
                id: id
            }
        });

        await modal.present();
    }
}