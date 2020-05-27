import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { BusyIndicatorService } from '@acharyarajasekhar/busy-indicator';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<any>(null);
  authState: Observable<firebase.User>;
  userClaims = new BehaviorSubject<any>({});

  constructor(
    private fireAuth: AngularFireAuth,
    private store: AngularFirestore,
    private busyIndicatorService: BusyIndicatorService,
    private router: Router) {

    this.authState = this.fireAuth.authState;
    this.authState.subscribe(u => this.user.next(u));

  }

  async logout() {
    await this.busyIndicatorService.show();
    this.fireAuth.signOut().then(() => {
      this.busyIndicatorService.hide();
      this.router.navigate(['/login']);
    })
  }

}
