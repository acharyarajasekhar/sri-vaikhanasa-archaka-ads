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
import { ReportAbuseService, ReportAbuseComponent } from '@acharyarajasekhar/ngx-report-abuse';
import { environment } from 'src/environments/environment';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [FirestoreDataPaginationService]
})
export class HomeComponent implements OnInit, OnDestroy {

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
    private reportAbuseService: ReportAbuseService,
    private actionSheetController: ActionSheetController
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

  async showOptions(post) {

    this.currentPost = post;
    const buttons = [];

    buttons.push({
      text: 'Report Abuse',
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

  async reportAbuse() {

    if (!!this.currentPost && !!this.currentPost.id) {

      const modal = await this.modalController.create({
        component: ReportAbuseComponent,
        componentProps: {
          payLoad: this.currentPost,
          formConfig: environment.formConfigs.reportAbuseForm,
          pageTitle: "Report this Ad..."
        }
      });

      modal.onDidDismiss().then(async result => {
        if (result.role === 'ok') {
          if (!!result.data) {

            this.busy.show();

            this.profileService.profile.pipe(take(1)).subscribe(mySelf => {
              if (!!mySelf) {

                let reportInfo = {
                  ...result.data,
                  reportedBy: mySelf
                }

                this.reportAbuseService.report(reportInfo).then(() => {
                  this.toast.show("Your information is saved...");
                  this.busy.hide();
                }).catch(err => {
                  this.toast.error(err);
                  this.busy.hide();
                });
              }
            })

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
