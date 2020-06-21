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

  notificationsList: Array<any> = [];

  constructor(
    private modalController: ModalController,
    private notificationService: NotificationService) { }

  ngOnInit(): void {
    this.notificationsList = this.notificationService.listOfNotifications;
  }

  get sortedNotifications() {
    if (!!this.notificationsList && this.notificationsList.length > 0) {
      return _.orderBy(this.notificationsList, ['dttm'], ['desc']);
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
    this.notificationsList = [];
    this.notificationService.clearAll();
  }

  async clearThis(id, index) {
    this.notificationsList.splice(index, 1);
    await this.notificationService.deleteOne(id);
  }

  cancel() {
    this.modalController.dismiss(null, 'cancel');
  }

}
