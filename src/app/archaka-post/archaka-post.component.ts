import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'archaka-post-card',
  templateUrl: './archaka-post.component.html',
  styleUrls: ['./archaka-post.component.css']
})
export class ArchakaPostComponent implements OnInit {

  @Input() post: any;
  @Output() onOptionsClick = new EventEmitter();

  constructor() { }
  ngOnInit() { }

  showOptions() {
    if (!!this.onOptionsClick) {
      this.onOptionsClick.emit(this.post);
    }
  }

}
