import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment'; 
import { Router, NavigationEnd, Event as RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

import "@capacitor-community/firebase-analytics";
import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
import { Plugins } from "@capacitor/core";
const { Device } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  analyticsEnabled = true;

  constructor(private router: Router) {
    this.initFb();
    this.router.events.pipe(
      filter((e: RouterEvent): e is NavigationEnd => e instanceof NavigationEnd), // Filter only NavigationEnd events
    ).subscribe((e: NavigationEnd) => {
      console.log('route changed: ', e.url);
      this.setScreenName(e.url);
    });
  }
  

  async initFb() {
    if ((await Device.getInfo()).platform == 'web') {
      FirebaseAnalytics.initializeFirebase(environment.firebase);
    }
  }

  setUser() {
    // Use Firebase Auth uid
    FirebaseAnalytics.setUserId({
      userId: "test_123",
    });
  }

  setProperty() {
    FirebaseAnalytics.setUserProperty({
      name: "framework",
      value: "angular",
    });
  }

  logEvent() {
    FirebaseAnalytics.logEvent({
      name: "login",
      params: {
        method: "email"
      }
    });
  }

  setScreenName(screenName) {
    FirebaseAnalytics.setScreenName({
      screenName
    });
  }

  toggleAnalytics() {
    this.analyticsEnabled = !this.analyticsEnabled;
    FirebaseAnalytics.setCollectionEnabled({
      enabled: this.analyticsEnabled,
    });
  }
}
