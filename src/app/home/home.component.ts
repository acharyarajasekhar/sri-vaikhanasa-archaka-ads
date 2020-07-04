import { Component, OnInit, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { ModalController, IonContent, AlertController } from '@ionic/angular';
import { PostsService } from '../services/posts.service';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirestoreDataPaginationService, WhereCondition, QueryConfig } from '@acharyarajasekhar/ngx-utility-services';
import { environment } from 'src/environments/environment';
import { ArchakaPostViewComponent } from '../archaka-post-view/archaka-post-view.component';
import { ViewNotificationsComponent } from '../view-notifications/view-notifications.component';
import { NotificationService } from '../services/notification.service';

import { Plugins } from "@capacitor/core";
const { Share } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [FirestoreDataPaginationService]
})
export class HomeComponent implements OnInit, OnDestroy {

  @ViewChild(IonContent, { static: false }) content: IonContent;

  slides: Array<string> = ['assets/defaults/lord.jpg'];
  private conditions = new Array<WhereCondition>();

  private queryConfig: QueryConfig = {
    pathToCollection: 'archakaposts',
    fieldToSort: 'updatedAt',
    limitPerBatch: 5,
    sortOrder: 'desc',
    where: this.conditions
  }

  private posts: Array<any> = [];

  get sortedPosts() {
    if (!!this.posts && this.posts.length > 0) {
      return _.orderBy(this.posts, ['updatedAt'], ['desc']);
    }
    return [];
  }

  destroyed$ = new Subject<boolean>();

  isEmpty: boolean = true;
  isEndOfPageReached: boolean = false;
  isLoading: boolean = false;

  get notificationCount() {
    return this.notificationService.getCount();
  }

  constructor(
    private modalController: ModalController,
    private postsService: PostsService,
    private toast: ToastService,
    private alertController: AlertController,
    public page: FirestoreDataPaginationService,
    private ngZone: NgZone,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {

    this.page.done.pipe(takeUntil(this.destroyed$)).subscribe(flag => {
      this.isEndOfPageReached = flag;
    });

    this.page.loading.pipe(takeUntil(this.destroyed$)).subscribe(flag => {
      this.ngZone.run(() => this.isLoading = flag);
    });

  }

  ionViewDidEnter() {
    this.queryConfig.where.push({ fieldPath: 'isActive', opStr: '==', value: true });
    this.queryConfig.where.push({ fieldPath: 'isVerified', opStr: '==', value: true });
    this.page.init(this.queryConfig);
    this.page.data.subscribe(posts => {
      this.ngZone.run(() => {
        this.posts = posts
      });
    });
  }

  loadData(event) {
    if (!this.isEmpty) {
      this.page.more();
      let handle = this.page.loading.subscribe((flag) => {
        if (!!flag) {
          setTimeout(() => {
            event.target.complete();
            if (!!handle) { handle.unsubscribe() }
          }, 500);
        }
      })
    }
    else {
      event.target.complete();
    }
  }

  async addNew() {
    await this.postsService.addNew();
  }

  async invite() {
    await Share.share({
      title: environment.defaults.appInvitation.subject,
      text: environment.defaults.appInvitation.message,
      url: 'https://play.google.com/store/apps/details?id=net.srivaikhanasa.archakaads',
      dialogTitle: 'Invite Others'
    });
  }

  async rateThisApp() {

    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Rate This App...',
      message: 'If you enjoy using Archaka Ads App, would you mind taking a moment to rate it on play store? Thank you so much!',
      buttons: [
        {
          text: 'No, Thanks',
          role: 'cancel',
          handler: () => { }
        }, {
          text: 'Rate It Now',
          handler: () => {
            Plugins.CapacitorRateApp.requestReview();
          }
        }
      ]
    });

    await alert.present();

  }

  async writeFeedback() {
    await this.postsService.writeFeedback();
  }

  async showOptions(post) {
    await this.postsService.showPostOptions(post);
  }

  scrollToElement(id: string) {
    var titleELe = document.getElementById(id);
    this.content.scrollToPoint(0, titleELe.offsetTop, 1000);
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

  async openNotifications() {
    const modal = await this.modalController.create({
      component: ViewNotificationsComponent
    });

    modal.onDidDismiss().then(() => {
      this.notificationService.setAllAsRed();
    })

    await modal.present();
  }

  ngOnDestroy() {
    this.page.detachListeners();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
