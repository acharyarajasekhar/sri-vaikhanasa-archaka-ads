import { Component, OnInit } from '@angular/core';

import { Platform, AlertController, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Router, RouterEvent } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ProfileService } from './services/profile.service';
import { NetworkService, NetworkAlertService } from '@acharyarajasekhar/network-alert';
import { BackButtonEvent } from '@ionic/core';

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
    private alertController: AlertController,
    private toastCtrl: ToastController
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
      this.registerBackButtonHandler();
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

  private lastTimeBackPress = 0;
  private timePeriodToExit = 2000;

  registerBackButtonHandler() {

    this.platform.backButton.subscribeWithPriority(10, async () => {


      if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
        navigator['app'].exitApp(); // Exit app
      } else {
        const toast = await this.toastCtrl.create({
          message: 'Press back again to exit...',
          duration: 2000
        });
        toast.present();
        this.lastTimeBackPress = new Date().getTime();
      }

      // const alert = await this.alertController.create({
      //   header: 'Confirm!',
      //   message: 'Do you really want to <strong>Exit this App</strong>!!!',
      //   buttons: [
      //     {
      //       text: 'No',
      //       role: 'cancel',
      //       handler: (blah) => { }
      //     }, {
      //       text: 'Yes',
      //       handler: () => {
      //         App.exitApp();
      //       }
      //     }
      //   ]
      // });

      // await alert.present();

    });

  }

  logout() {
    this.authService.logout();
  }
}
