import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAnalytics,getAnalytics,ScreenTrackingService,UserTrackingService } from '@angular/fire/analytics';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { provideFunctions,getFunctions } from '@angular/fire/functions';
import { provideMessaging,getMessaging } from '@angular/fire/messaging';
import { providePerformance,getPerformance } from '@angular/fire/performance';
import { provideStorage,getStorage } from '@angular/fire/storage';
import { PaymentService } from './payment.service';
import { DataProviderService } from './core/data-provider.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CartService } from './authorized/cart/cart.service';
import { FileInterceptorInterceptor } from './authorized/interceptors/file-interceptor.interceptor';
import { StoreModule } from '@ngrx/store';
import { EffectsModule, EffectsRootModule } from '@ngrx/effects';


@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, ReactiveFormsModule,HttpClientModule,
    FormsModule,
    StoreModule.forRoot({}),
    EffectsModule.forRoot([]),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAnalytics(() => getAnalytics()),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions()),
    provideMessaging(() => getMessaging()),
    providePerformance(() => getPerformance()),
    provideStorage(() => getStorage()),],
  providers: [{ 
    provide: HTTP_INTERCEPTORS, useClass: FileInterceptorInterceptor, multi:true
  },{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
     ScreenTrackingService,UserTrackingService,PaymentService,DataProviderService, CartService
    ],
  bootstrap: [AppComponent],
})
export class AppModule { }
