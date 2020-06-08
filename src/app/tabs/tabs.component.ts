import { Component, OnInit, Input } from '@angular/core';
import { Platform } from '@ionic/angular';
import { environment } from 'src/environments/environment';
import { Router, RouterEvent } from '@angular/router';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';

import {
  Plugins,
  PushNotification,
  PushNotificationToken,
  PushNotificationActionPerformed
} from '@capacitor/core';

const { PushNotifications } = Plugins;

import { FCM } from "capacitor-fcm";
const fcm = new FCM();

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
    private router: Router,
    private toast: ToastService
  ) { }

  ngOnInit(): void {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.isMobileView = true;
      this.initializePushNotifications();
    }
    this.router.events.subscribe((event: RouterEvent) => {
      if (!!event.id) {
        this.activePath = event.url;
      }
    })
  }

  initializePushNotifications() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermission().then(result => {
      if (result.granted) {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();

        fcm
          .subscribeTo({ topic: "newarchakaads" })
          .then(r => console.log(`subscribed to topic`))
          .catch(err => console.log(err));

      } else {
        // Show some error
        console.log("Push Notifications - Permission Denied");
      }
    });

    PushNotifications.addListener('registration',
      (token: PushNotificationToken) => {
        console.log('Push registration success, token: ' + token.value);
      }
    );

    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotification) => {
        console.log('Push received: ' + JSON.stringify(notification));
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: PushNotificationActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      }
    );
  }

  selectMe(url) {
    this.router.navigate([url]);
  }

}
