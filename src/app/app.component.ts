import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Router, RouterEvent } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProfileService } from './services/profile.service';
import { NetworkService, NetworkAlertService } from '@acharyarajasekhar/network-alert';
import { BackButtonHandler } from '@acharyarajasekhar/ngx-utility-services';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit {

  get defaults() {
    return environment.defaults;
  }

  public profile: any = {};
  public activePath: string = '';
  public showSideMenu: boolean = false;

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
    private networkService: NetworkService,
    private networkAlertService: NetworkAlertService,
    private backButtonHandler: BackButtonHandler
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      if (this.platform.is('android') || this.platform.is('ios')) {
        this.statusBar.styleDefault();
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#004a8f');
        SplashScreen.hide();
      }

      this.profileService.profile.subscribe(p => {
        this.profile = p;
      });
      this.backButtonHandler.init();
    });
  }

  ngOnInit() {
    
    this.networkService.onlineChanges.subscribe(isOnline => {
      if (isOnline) this.networkAlertService.hide();
      else this.networkAlertService.show();
    })

    this.router.events.subscribe((event: RouterEvent) => {
      if (!!event.id) {
        this.activePath = event.url;
      }
    })

    this.authService.authState.subscribe(u => {
      this.showSideMenu = !!u;
    })

  }

  logout() {
    this.authService.logout();
  }
}
