import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer-web',
  templateUrl: './footer-web.component.html',
  styleUrls: ['./footer-web.component.scss'],
})
export class FooterWebComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  openPrivacy() {
    this.router.navigate(['authorized/privacy-policy']);
  }

  openTnC() {
    this.router.navigate(['authorized/tnc']);
  }

  openRefund() {
    this.router.navigate(['authorized/refund-policy']);
  }
}
