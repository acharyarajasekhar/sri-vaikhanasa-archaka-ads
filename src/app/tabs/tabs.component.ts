import { Component, OnInit, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Router, RouterEvent } from '@angular/router';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.css']
})
export class TabsComponent implements OnInit {

  activePath: string = '';
  isMobileView: boolean = false;

  get defaults() {
    return environment.defaults;
  }

  constructor(
    private platform: Platform,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.isMobileView = true;
    }
    this.router.events.subscribe((event: RouterEvent) => {
      if (!!event.id) {
        this.activePath = event.url;
      }
    })
  }

  selectMe(url) {
    this.router.navigate([url]);
  }

}
