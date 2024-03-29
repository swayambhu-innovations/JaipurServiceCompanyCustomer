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
    this.router.navigate(['/privacy-policy']);
  }

  openTnC() {
    this.router.navigate(['/tnc']);
  }

  openRefund() {
    this.router.navigate(['/refund-policy']);
  }
}
