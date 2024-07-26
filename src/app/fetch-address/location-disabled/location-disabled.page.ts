import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-disabled',
  templateUrl: './location-disabled.page.html',
  styleUrls: ['./location-disabled.page.scss'],
})
export class LocationDisabledPage implements OnInit {
  constructor(private router: Router) {
    setInterval(() => {
      this.router.navigate(['/fetch-address']);
    }, 5000);
  }

  ngOnInit() {}
}
