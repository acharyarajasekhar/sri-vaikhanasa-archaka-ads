import { Component, OnInit, NgZone, OnDestroy } from '@angular/core';
import { ModalController, ActionSheetController } from '@ionic/angular';
import { ArchakaPostEditorComponent } from '../archaka-post-editor/archaka-post-editor.component';
import { PostsService } from '../services/posts.service';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { FirestoreDataPaginationService, WhereCondition, QueryConfig } from '@acharyarajasekhar/ngx-utility-services';
import { AuthService } from '../services/auth.service';
import { environment } from 'src/environments/environment';
import { ProfileService } from '../services/profile.service';
import { NativeSocialSharingService, NativeAppVersionService, NativeAppRateService } from '@acharyarajasekhar/ion-native-services';
import { NgxGenericFormComponent, NgxGenericFormService } from '@acharyarajasekhar/ngx-generic-form';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [FirestoreDataPaginationService]
})
export class HomeComponent implements OnInit, OnDestroy {

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
  private currentPost: any;

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

  constructor(
    private modalController: ModalController,
    private postsService: PostsService,
    private toast: ToastService,
    private busy: BusyIndicatorService,
    public page: FirestoreDataPaginationService,
    private ngZone: NgZone,
    private profileService: ProfileService,
    private actionSheetController: ActionSheetController,
    private nativeSocialSharingService: NativeSocialSharingService,
    private nativeAppRateService: NativeAppRateService,
    private ngxGenericFormService: NgxGenericFormService,
    private nativeAppVersionService: NativeAppVersionService
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
    const modal = await this.modalController.create({
      component: ArchakaPostEditorComponent
    });

    modal.onDidDismiss().then(result => {
      if (result.role === 'ok') {
        if (!!result.data) {

          this.busy.show();

          this.postsService.addOrUpdatePost(result.data).then(() => {
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

  invite() {
    this.nativeSocialSharingService.share(environment.defaults.appInvitation).then(() => { }).catch(err => this.toast.error(err));
  }

  rateThisApp() {
    this.nativeAppRateService.promptNow().then(() => { }).catch(err => this.toast.error(err));
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
                providedBy: mySelf
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

  async showOptions(post) {

    this.currentPost = post;
    const buttons = [];

    buttons.push({
      text: 'Report this Ad...',
      icon: 'assets/icons/abuse.svg',
      cssClass: 'dangerbutton',
      handler: async () => { this.reportAbuse(); }
    });

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

  async reportAbuse() {

    if (!!this.currentPost && !!this.currentPost.id) {

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
                  await this.postsService.hideThisPost(this.currentPost.id);
                }

                let reportInfo = {
                  subject: this.currentPost,
                  reportedInfo: result.data,
                  reportedBy: mySelf
                }

                this.handleUndefined(reportInfo);

                await this.ngxGenericFormService.report('reportabuse', reportInfo);
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
  }

  ngOnDestroy() {
    this.page.detachListeners();
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

}
