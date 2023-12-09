import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrls: ['./header1.component.scss'],
})
export class Header1Component  implements OnInit {
  @Input() name!:string;
  constructor(
    public location:Location,private router: Router,
  ) { }

  notification(){
    this.router.navigate(['authorized/notification'])
  }

  ngOnInit() {}

}
