import { Component, OnInit, NgZone } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { ProfileEditorComponent } from './profile-editor/profile-editor.component';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import { NativeImagePickerService } from '@acharyarajasekhar/ion-native-services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  profile: any;

  get defaults() {
    return environment.defaults;
  }

  public subTitles: Array<string> = []

  constructor(
    private profileService: ProfileService,
    private modalController: ModalController,
    private toast: ToastService,
    private busy: BusyIndicatorService,
    private imagePickerService: NativeImagePickerService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.profileService.profile.subscribe(p => {
      this.profile = p || {};
      if (!!p) {
        this.subTitles = [p.phoneNumber];
      }
    })
  }

  async editProfile() {
    const modal = await this.modalController.create({
      component: ProfileEditorComponent,
      componentProps: {
        profile: this.profile
      }
    });

    modal.onDidDismiss().then(result => {
      if (result.role === 'ok') {
        if (!!result.data) {

          this.busy.show();

          this.profile = {
            ...this.profile,
            ...result.data
          }

          this.profileService.updateProfile(this.profile).then(() => {
            this.toast.show("Profile updated successfully...");
            this.busy.hide();
          }).catch(err => {
            console.log(err);
            this.toast.error(err);
            this.busy.hide();
          });

        }
      }
    })

    return await modal.present();
  }


  images: Array<string> = []

  selectImages() {
    this.imagePickerService.pick(2).then(images => {
      this.zone.run(() => {
        console.log(images)
        this.images = images;
      });     
    })
  }

}
