import { Component, OnInit, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { PostsService } from '../services/posts.service';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FirestoreDataPaginationService, WhereCondition, QueryConfig } from '@acharyarajasekhar/ngx-utility-services';
import { environment } from 'src/environments/environment';
import { NativeSocialSharingService, NativeAppRateService } from '@acharyarajasekhar/ion-native-services';
import { ArchakaPostViewComponent } from '../archaka-post-view/archaka-post-view.component';
import { ViewNotificationsComponent } from '../view-notifications/view-notifications.component';
import { NotificationService } from '../services/notification.service';

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
    public page: FirestoreDataPaginationService,
    private ngZone: NgZone,
    private nativeSocialSharingService: NativeSocialSharingService,
    private nativeAppRateService: NativeAppRateService,
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

    // this.notificationService.tappedNotification$.asObservable().subscribe(async notification => {
    //   alert(JSON.stringify(notification));
    //   if (!!notification) {
    //     if (notification.notification.data.type === "archakaad") {
    //       let id = notification.notification.data.id;
    //       if (!!id) {
    //         await this.openPost(id);
    //       }
    //     }
    //     this.notificationService.resetTappedNotification();
    //   }
    // })

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

  invite() {
    this.nativeSocialSharingService.share(environment.defaults.appInvitation).then(() => { }).catch(err => this.toast.error(err));
  }

  rateThisApp() {
    this.nativeAppRateService.promptNow().then(() => { }).catch(err => this.toast.error(err));
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

    await modal.present();
  }

  ngOnDestroy() {
    this.page.detachListeners();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
