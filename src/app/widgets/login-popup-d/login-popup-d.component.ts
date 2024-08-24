import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login-popup-d',
  templateUrl: './login-popup-d.component.html',
  styleUrls: ['./login-popup-d.component.scss'],
})
export class LoginPopupDComponent  implements OnInit {

  constructor(private router: Router) { }
  isOpen :boolean;

  ngOnInit() {}

  closeModal() {
    this.isOpen=false;
  }

  skipLogin() {
    this.isOpen=false;
    // this.router.navigate(['home'])
  }

  login() {
   
    this.router.navigate(['/unauthorized/jsc-logo']);
    this.isOpen=false;
     
  }

}
