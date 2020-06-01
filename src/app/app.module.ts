import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { BusyIndicatorModule } from '@acharyarajasekhar/busy-indicator';
import { ProfileCardModule } from '@acharyarajasekhar/profile-card';
import { NetworkAlertModule } from '@acharyarajasekhar/network-alert';

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
import { ReportAbuseModule } from '@acharyarajasekhar/ngx-report-abuse';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { NativeImagePickerService } from '@acharyarajasekhar/ion-native-services';


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
      MyPostsComponent
   ],
   entryComponents: [],
   imports: [
      BrowserModule,
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
      ReportAbuseModule,
      NgxUtilityPipesModule
   ],
   providers: [
      NativeImagePickerService,
      ImagePicker,
      StatusBar,
      SplashScreen,
      { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
   ],
   bootstrap: [
      AppComponent
   ],
   schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
