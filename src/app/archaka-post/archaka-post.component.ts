import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'archaka-post-card',
  templateUrl: './archaka-post.component.html',
  styleUrls: ['./archaka-post.component.css']
})
export class ArchakaPostComponent implements OnInit {

  @Input() isMyPost: boolean = false;
  @Input() post: any;
  @Output() onOptionsClick = new EventEmitter();

  constructor(private profileService: ProfileService) { }
  ngOnInit() { }

  showOptions() {
    if (!!this.onOptionsClick) {
      this.onOptionsClick.emit(this.post);
    }
  }

  showThisProfile(profile) {
    this.profileService.showThisProfile(profile);
  }

}
