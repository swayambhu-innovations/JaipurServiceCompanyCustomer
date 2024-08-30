import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
    private dataProvider: DataProviderService
  ) {}

  ngOnInit() {
    this.authService
    .checkVersion()
    .then((res) => {
      this.currentVersion = Number(res.data()!['versionCode']);
      this.installedVersion = Number(this.dataProvider.versionCode);
      // console.log(res.data());
      // console.log(this.installedVersion);
      // console.log(this.currentVersion);
      // if (this.installedVersion >= this.currentVersion)
      //   this.router.navigate(['/fetch-address']);
    })
  }

  ionViewDidEnter() {
    this.authService
      .checkVersion()
      .then((res) => {
        this.currentVersion = Number(res.data()!['versionCode']);
        this.installedVersion = Number(this.dataProvider.versionCode);
        console.log(this.installedVersion);
        console.log(this.currentVersion);
        if (this.installedVersion >= this.currentVersion)
          console.log('version');
          // this.router.navigate(['/fetch-address']);
      })
     
  }

  confirmUpdate() {}
}
