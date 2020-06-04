import { Component } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './profile-popup-card.component.html',
  styleUrls: ['./profile-popup-card.component.css']
})
export class ProfilePopupCardComponent {

  subTitles: Array<string> = [];

  get defaults() {
    return environment.defaults;
  }

  profile: any;

}
