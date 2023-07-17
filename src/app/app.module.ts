import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HomePageModule } from './home/home.module';
import { AllCategoriesComponent } from './all-categories/all-categories.component';
import { AcRepairComponent } from './ac-repair/ac-repair.component';
import { NotificationComponent } from './Notification/notification/notification.component';
import { NoNotificationComponent } from './Notification/no-notification/no-notification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchPipe } from './home/search.pipe';
import { CommonModule } from '@angular/common';





@NgModule({
  declarations: [
    AppComponent,
    AllCategoriesComponent,
    AcRepairComponent,
    NotificationComponent,
    NoNotificationComponent,
    SearchPipe,

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
