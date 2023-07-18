import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { AllCategoriesComponent } from './all-categories/all-categories.component';

import { NotificationComponent } from './Notification/notification/notification.component';
import { NoNotificationComponent } from './Notification/no-notification/no-notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { SearchPipe } from './search.pipe';
import { ReferAFriendComponent } from './refer-afriend/refer-afriend.component';
import { NewAddressComponent } from './new-address/new-address.component';
import { SelectAddressComponent } from './select-address/select-address.component';





@NgModule({
  declarations: [
    AppComponent,
    NewAddressComponent,
    SelectAddressComponent,
    AllCategoriesComponent,
    ReferAFriendComponent,
    NotificationComponent,
    NoNotificationComponent,
    HomeComponent,
    SearchPipe
  ],
  imports:
    [
      BrowserModule,
      IonicModule.forRoot(),
      AppRoutingModule,
      FormsModule,
      ReactiveFormsModule,
      CommonModule

    ],
  exports:
    [
      SearchPipe
    ],
  providers:
    [{
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }],
  bootstrap: [AppComponent],
})
export class AppModule { }
