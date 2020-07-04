import { Component, OnInit } from '@angular/core';
import { ProfileService } from '../services/profile.service';
import { environment } from 'src/environments/environment';
import { ModalController } from '@ionic/angular';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';

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
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.profileService.profile.subscribe(p => {
      this.profile = p || {};
    })
  }

  async editProfile() {
    await this.profileService.editProfile();
  }

}
