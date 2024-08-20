import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-jsc-logo',
  templateUrl: './jsc-logo.page.html',
  styleUrls: ['./jsc-logo.page.scss'],
})
export class JscLogoPage implements OnInit {
  constructor(private router: Router) {
    setTimeout(() => {
      this.router.navigate(['/unauthorized/login']);
    }, 1500);
  }

  ngOnInit() {}
}
