import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-fetch-address',
  templateUrl: './fetch-address.page.html',
  styleUrls: ['./fetch-address.page.scss'],
})
export class FetchAddressPage implements OnInit {

  constructor(
    private router: Router) { }

  ngOnInit() {
    setTimeout(() => {
      this.router.navigate([`/fetch-address/gps-map`]);
    }, 1500);
  }

}
