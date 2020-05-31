import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router, RouterEvent } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProfileService } from './services/profile.service';
import { NetworkService, NetworkAlertService } from '@acharyarajasekhar/network-alert';
import { BackButtonHandler } from '@acharyarajasekhar/ngx-utility-services';
import { PhotosFormControlService } from '@acharyarajasekhar/custom-form-controls';

import { Plugins } from '@capacitor/core';
const { App } = Plugins;

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

  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home-outline'
    },
    {
      title: 'My Ads',
      url: '/myads',
      icon: 'list-outline'
    },
    {
      title: 'My Profile',
      url: '/profile',
      icon: 'person-outline'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private router: Router,
    private authService: AuthService,
    private profileService: ProfileService,
    private networkService: NetworkService,
    private networkAlertService: NetworkAlertService,
    private backButtonHandler: BackButtonHandler,
    private photosFormControlService: PhotosFormControlService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
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
