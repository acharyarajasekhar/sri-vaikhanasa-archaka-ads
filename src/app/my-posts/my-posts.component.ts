import { Component, OnInit } from '@angular/core';
import { PostsService } from '../services/posts.service';
import * as _ from 'lodash';
import { ActionSheetController, ModalController, AlertController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { ArchakaPostEditorComponent } from '../archaka-post-editor/archaka-post-editor.component';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import { ToastService } from '../services/toast.service';
import { ReportAbuseComponent, ReportAbuseService } from '@acharyarajasekhar/ngx-report-abuse';
import { environment } from 'src/environments/environment';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent implements OnInit {

  currentPost: any = null;
  posts: Array<any> = [];

  get sortedPosts() {
    if (!!this.posts && this.posts.length > 0) {
      return _.orderBy(this.posts, ['updatedAt'], ['desc']);
    }
    return [];
  }

  constructor(
    private postsService: PostsService,
    private actionSheetController: ActionSheetController,
    private modalController: ModalController,
    private alertController: AlertController,
    private busy: BusyIndicatorService,
    private toast: ToastService,
    private authService: AuthService,
    private reportAbuseService: ReportAbuseService
  ) { }

  ngOnInit(): void {
    this.postsService.myPosts.subscribe(posts => {
      this.posts = posts;
    })
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
      text: 'Edit',
      icon: 'assets/icons/edit.svg',
      handler: () => { this.edit(); }
    });
    buttons.push({
      text: 'Delete',
      icon: 'assets/icons/delete.svg',
      cssClass: 'dangerbutton',
      handler: () => { this.delete(); }
    });
    // buttons.push({
    //   text: 'Report Abuse',
    //   icon: 'assets/icons/abuse.svg',
    //   cssClass: 'dangerbutton',
    //   handler: async () => { this.reportAbuse(); }
    // });

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

            let mySelf = await this.authService.user.pipe(take(1)).toPromise();

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

          } ``
        }
      })

      return await modal.present();

    }
  }

  async delete() {

    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: 'Do you really want to <strong>DELETE</strong> this Ad ?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => { }
        }, {
          text: 'Yes',
          handler: async () => {
            this.busy.show();
            this.postsService.deleteMyPostById(this.currentPost.id).then(() => {
              this.busy.hide();
              this.toast.show("Ad is deleted");
            }).catch(err => {
              this.busy.hide();
              this.toast.error(err);
            });
          }
        }
      ]
    });

    await alert.present();

  }

  async edit() {
    if (!!this.currentPost && !!this.currentPost.id) {

      const modal = await this.modalController.create({
        component: ArchakaPostEditorComponent,
        componentProps: {
          post: this.currentPost,
          pageTitle: "Edit Ad..."
        }
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

          } ``
        }
      })

      return await modal.present();

    }
  }

}
