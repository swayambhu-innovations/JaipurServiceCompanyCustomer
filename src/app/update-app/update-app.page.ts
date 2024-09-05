import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { Platform } from '@ionic/angular';
import { AuthService } from 'src/app/core/auth.service';
import { DataProviderService } from 'src/app/core/data-provider.service';

@Component({
  selector: 'app-update-app',
  templateUrl: './update-app.page.html',
  styleUrls: ['./update-app.page.scss'],
})
export class UpdateAppPage implements OnInit {
  installedVersion: number = 0;
  currentVersion: number = 0;

  constructor(
    private authService: AuthService,
    private router: Router,
    private platform: Platform,
    private dataProvider: DataProviderService
  ) {}

  ngOnInit() {}

  async ionViewDidEnter() {
    if (this.platform.is('capacitor')) {
      await App.getInfo().then(async (info) => {
        this.installedVersion = Number(info.version);
        await this.authService.checkVersion().then((res) => {
          this.currentVersion = Number(res.data()!['versionCode']);
          if (this.installedVersion >= this.currentVersion)
            this.router.navigate(['/fetch-address']);
        });
      });
    } else {
      this.router.navigate(['/fetch-address']);
    }
  }

  confirmUpdate() {}
}
