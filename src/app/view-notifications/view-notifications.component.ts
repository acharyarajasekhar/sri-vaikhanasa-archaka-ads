import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { ModalController } from '@ionic/angular';
import { ArchakaPostViewComponent } from '../archaka-post-view/archaka-post-view.component';

@Component({
  templateUrl: './view-notifications.component.html',
  styleUrls: ['./view-notifications.component.css']
})
export class ViewNotificationsComponent implements OnInit {

  notifications$: any;

  constructor(
    private modalController: ModalController,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notifications$ = this.notificationService.listOfNotifications$.asObservable();
  }

  async openPost(id: string) {

    if (!!!id) return;

    const modal = await this.modalController.create({
      component: ArchakaPostViewComponent,
      componentProps: {
        id: id
      }
    });

    await modal.present();
  }

  get notificationCount() {
    return this.notificationService.getCount();
  }

  ClearAll() {
    this.notificationService.clearAll();
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

}
