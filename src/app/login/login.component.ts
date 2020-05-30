import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import * as firebase from 'firebase/app';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';
import { Router } from '@angular/router';
import { ToastService } from '@acharyarajasekhar/ngx-utility-services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  windowRef: any = window;

  @ViewChild('captchaDiv', { static: true }) public reCaptchaDivRef: ElementRef;

  phoneNumber: string;
  verificationCode: string;

  constructor(
    private busy: BusyIndicatorService,
    private router: Router,
    private toast: ToastService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.windowRef.confirmationResult = null;
    let tempOpt = { size: 'invisible', badge: 'inline', callback: (resp) => { }, 'expired-callback': (resp) => { console.log(resp); } }
    this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(this.reCaptchaDivRef.nativeElement, tempOpt);
    this.windowRef.recaptchaVerifier.render();
  }

  sendLoginCode() {

    this.busy.show();

    const appVerifier = this.windowRef.recaptchaVerifier;
    const num = this.phoneNumber;

    firebase.auth().signInWithPhoneNumber(num, appVerifier)
      .then(result => {

        this.zone.run(() => {
          this.windowRef.confirmationResult = result;
        })
        this.busy.hide();
        this.toast.show("Verification code is sent to your mobile number");

      })
      .catch(error => {

        this.busy.hide();
        this.windowRef.confirmationResult = null;
        this.toast.error(error);

      });

  }

  verifyLoginCode() {

    this.busy.show();

    this.windowRef.confirmationResult
      .confirm(this.verificationCode)
      .then(result => {

        this.busy.hide();
        this.windowRef.confirmationResult = null;
        this.router.navigate(['/home']);
        this.toast.show("Login successfull...");

      })
      .catch(error => {

        this.busy.hide();
        this.toast.error(error);

      });
  }

}
