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
    window.open('/privacy-policy', '_blank');
  }

  openTnC() {
    window.open('/tnc', '_blank');
  }

  openRefund() {
    window.open('/refund-policy', '_blank');
  }
}
