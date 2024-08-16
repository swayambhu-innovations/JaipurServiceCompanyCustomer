import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import {
  provideAnalytics,
  getAnalytics,
  ScreenTrackingService,
  UserTrackingService,
} from '@angular/fire/analytics';
import { provideAuth, getAuth } from '@angular/fire/auth';
// import {
//   provideAppCheck,
//   getAppCheck,
//   ReCaptchaV3Provider,
// } from '@angular/fire/app-check'; // Import App Check
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { provideMessaging, getMessaging } from '@angular/fire/messaging';
import { providePerformance, getPerformance } from '@angular/fire/performance';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { PaymentService } from './payment.service';
import { DataProviderService } from './core/data-provider.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CartService } from './authorized/cart/cart.service';
import { FileInterceptorInterceptor } from './authorized/interceptors/file-interceptor.interceptor';
import { StoreModule } from '@ngrx/store';
import { EffectsModule, EffectsRootModule } from '@ngrx/effects';
// import { AppCheckService } from './app-check.service';
import { Amplify } from 'aws-amplify';

const amplifyConfig = {
  aws_project_region: 'ap-south-1',
  aws_cognito_identity_pool_id:
    'ap-south-1:0111d658-db6d-4377-b29d-3ce10a5b7384',
  aws_cognito_region: 'ap-south-1',
  aws_user_pools_id: 'ap-south-1_4VqSjAKTP',
  aws_user_pools_web_client_id: '5nbnc48s7c6ahjdlmofiugbnoa',
  oauth: {},
  aws_cognito_username_attributes: ['PHONE_NUMBER'],
  aws_cognito_social_providers: [],
  aws_cognito_signup_attributes: ['EMAIL', 'PHONE_NUMBER'],
  aws_cognito_mfa_configuration: 'OFF',
  aws_cognito_mfa_types: ['SMS'],
  aws_cognito_password_protection_settings: {
    passwordPolicyMinLength: 8,
    passwordPolicyCharacters: [],
  },
  aws_cognito_verification_mechanisms: ['EMAIL'],
};

Amplify.configure(amplifyConfig);

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    // provideAppCheck(() => getAppCheck(), {
    //   provider: new ReCaptchaV3Provider('6LfX6R0qAAAAAIcWWO84K20lue3arAI5wkWTBNf5'),
    //   isTokenAutoRefreshEnabled: true
    // }),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FileInterceptorInterceptor,
      multi: true,
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ScreenTrackingService,
    UserTrackingService,
    PaymentService,
    DataProviderService,
    CartService,
    // AppCheckService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
