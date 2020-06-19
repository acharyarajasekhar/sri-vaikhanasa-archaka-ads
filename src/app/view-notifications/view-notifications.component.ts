import { Component, OnInit } from '@angular/core';
import { NotificationService } from '../services/notification.service';
import { ModalController } from '@ionic/angular';
import { ArchakaPostViewComponent } from '../archaka-post-view/archaka-post-view.component';
import * as _ from 'lodash';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  templateUrl: './view-notifications.component.html',
  styleUrls: ['./view-notifications.component.css'],
  animations: [
    trigger('listItemState', [
      state('in',
        style({
          opacity: 1,
          height: '*',
          minHeight: '*'
        })
      ),
      transition('* => void', [
        animate('0.25s ease-out', style({
          opacity: 0,
          height: '1px',
          minHeight: '1px'
        }))
      ])
    ])
  ]
})
export class ViewNotificationsComponent implements OnInit {

  constructor(
    private modalController: ModalController,
    private notificationService: NotificationService) { }

  ngOnInit(): void { }

  get sortedNotifications() {
    if (!!this.notificationService.listOfNotifications && this.notificationService.listOfNotifications.length > 0) {
      return _.orderBy(this.notificationService.listOfNotifications, ['dttm'], ['desc']);
    }
    return [];
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
    return this.sortedNotifications.length;
  }

  ClearAll() {
    this.notificationService.clearAll();
  }

  async clearThis(id) {
    await this.notificationService.deleteOne(id);
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

}
