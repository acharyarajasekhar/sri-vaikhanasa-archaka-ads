import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Router, RouterEvent } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProfileService } from './services/profile.service';
import { NetworkService, NetworkAlertService } from '@acharyarajasekhar/ngx-network-alert';
import { BackButtonHandler, ToastService } from '@acharyarajasekhar/ngx-utility-services';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Plugins } from '@capacitor/core';
import { NativeAppRateService, NativeAppVersionService } from '@acharyarajasekhar/ion-native-services';
import { NotificationService } from './services/notification.service';

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
    private backButtonHandler: BackButtonHandler,
    private nativeAppRateService: NativeAppRateService,
    private nativeAppVersionService: NativeAppVersionService,
    private notificationService: NotificationService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(async () => {
      if (this.platform.is('android') || this.platform.is('ios')) {
        this.statusBar.styleDefault();
        this.statusBar.overlaysWebView(false);
        this.statusBar.backgroundColorByHexString('#004a8f');
        setTimeout(() => {
          SplashScreen.hide();
        }, 500);
        this.nativeAppVersionService.init().then(() => {
          this.nativeAppRateService.init();
        });        
      }

      this.profileService.profile.subscribe(p => {
        this.profile = p;
      });
      this.notificationService.init();
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
