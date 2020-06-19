import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { BusyIndicatorModule } from '@acharyarajasekhar/busy-indicator';
import { ProfileCardModule } from '@acharyarajasekhar/profile-card';
import { NetworkAlertModule } from '@acharyarajasekhar/ngx-network-alert';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { environment } from 'src/environments/environment';
import { FormsModule } from '@angular/forms';
import { ProfileEditorComponent } from './profile/profile-editor/profile-editor.component';
import { GoogleMapsModule } from '@acharyarajasekhar/google-maps';
import { DynamicFormsModule } from '@acharyarajasekhar/dynamic-forms';
import { UploadProgressIndicatorModule } from '@acharyarajasekhar/upload-progress-indicator';
import { ArchakaPostComponent } from './archaka-post/archaka-post.component';
import { ArchakaPostEditorComponent } from './archaka-post-editor/archaka-post-editor.component';
import { PhotoSlidesCardModule } from '@acharyarajasekhar/ion-photo-slides-card';
import { UserProfilePipe } from './pipes/pipes/user-profile.pipe';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { NgxImagePreloaderModule } from '@acharyarajasekhar/ngx-image-preloader';
import { NgxUtilityPipesModule } from '@acharyarajasekhar/ngx-utility-pipes';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { NativeImagePickerService, PhotoViewerModule, NativeFirebaseAuthService, NativeSocialSharingService, NativeAppRateService, NativeAppVersionService, NativePhotoViewerService } from '@acharyarajasekhar/ion-native-services';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { NgxFirebasePhoneLoginModule } from '@acharyarajasekhar/ngx-firebase-phone-login';
import { ProfilePopupCardComponent } from './profile/profile-popup-card/profile-popup-card.component';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { TabsComponent } from './tabs/tabs.component';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { AppRate } from '@ionic-native/app-rate/ngx';
import { NgxGenericFormModule } from '@acharyarajasekhar/ngx-generic-form';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { ArchakaPostViewComponent } from './archaka-post-view/archaka-post-view.component';
import { ViewNotificationsComponent } from './view-notifications/view-notifications.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      HomeComponent,
      ProfileComponent,
      ProfileEditorComponent,
      ArchakaPostComponent,
      ArchakaPostEditorComponent,
      UserProfilePipe,
      MyPostsComponent,
      ProfilePopupCardComponent,
      TabsComponent,
      ArchakaPostViewComponent,
      ViewNotificationsComponent
   ],
   entryComponents: [ArchakaPostViewComponent, ViewNotificationsComponent],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      FormsModule,
      AngularFireModule.initializeApp(environment.firebaseConfig),
      AngularFireAuthModule,
      AngularFirestoreModule,
      BusyIndicatorModule,
      UploadProgressIndicatorModule,
      ProfileCardModule,
      DynamicFormsModule,
      GoogleMapsModule,
      NetworkAlertModule,
      NgxImagePreloaderModule,
      PhotoSlidesCardModule,
      NgxUtilityPipesModule,
      PhotoViewerModule,
      NgxFirebasePhoneLoginModule,
      NgxGenericFormModule
   ],
   providers: [
      NativeFirebaseAuthService,
      NativeImagePickerService,
      NativeSocialSharingService,
      NativeAppRateService,
      NativeAppVersionService,
      NativePhotoViewerService,
      ImagePicker,
      PhotoViewer,
      AndroidPermissions,
      StatusBar,
      SocialSharing,
      AppRate,
      AppVersion,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
   ],
   bootstrap: [
      AppComponent
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
