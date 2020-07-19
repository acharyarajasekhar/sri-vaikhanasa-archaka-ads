import { Component, OnInit, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { ModalController, IonContent } from '@ionic/angular';
import { PostsService } from '../services/posts.service';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { FirestoreDataPaginationService, WhereCondition, QueryConfig } from '@acharyarajasekhar/ngx-utility-services';
import { ArchakaPostViewComponent } from '../archaka-post-view/archaka-post-view.component';
import { ViewNotificationsComponent } from '../view-notifications/view-notifications.component';
import { NotificationService } from '../services/notification.service';
import { TranslateService } from '@ngx-translate/core';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import { ProfileService } from '../services/profile.service';

import { trigger, state, style, transition, animate } from '@angular/animations';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [FirestoreDataPaginationService],
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

  get currentLanguage() {
    return this.translate.currentLang || 'en';
  }

  isLanguageAlertRequired: boolean = false;

  userName: any = { name: 'User' };

  constructor(
    private modalController: ModalController,
    private postsService: PostsService,
    public page: FirestoreDataPaginationService,
    private ngZone: NgZone,
    private notificationService: NotificationService,
    private translate: TranslateService,
    private busy: BusyIndicatorService
  ) { }

  ngOnInit() {

    this.page.done.pipe(takeUntil(this.destroyed$)).subscribe(flag => {
      this.isEndOfPageReached = flag;
    });

    this.page.loading.pipe(takeUntil(this.destroyed$)).subscribe(flag => {
      this.ngZone.run(() => this.isLoading = flag);
    });

    if (this.currentLanguage == 'en' || this.currentLanguage == 'te' || this.currentLanguage == 'kn') {
      this.isLanguageAlertRequired = false;
    }
    else {
      this.isLanguageAlertRequired = true;
    }

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
    await this.postsService.shareThisApp();
  }

  async rateThisApp() {
    await this.postsService.rateThisApp();
  }

  async writeFeedback() {
    await this.postsService.writeFeedback();
  }

  async chooseLang(lang: string, alertRequired: boolean = false) {
    this.busy.show();
    this.isLanguageAlertRequired = alertRequired;
    this.translate.use(lang).pipe(take(1)).subscribe(async () => {
      await Storage.set({
        key: 'app-lang',
        value: lang
      });
      this.ngZone.run(() => {
        setTimeout(() => {
          this.busy.hide();
        }, 500);
      })
    }, () => {
      this.ngZone.run(() => {
        setTimeout(() => {
          this.busy.hide();
        }, 500);
      })
    });
  }

  closeLanguageAlert() {
    // this.isLanguageAlertRequired = false;
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
