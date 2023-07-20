import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-header1',
  templateUrl: './header1.component.html',
  styleUrls: ['./header1.component.scss'],
})
export class Header1Component  implements OnInit {
  @Input() name!:string;
  constructor(
    public location:Location
  ) { }

  ngOnInit() {}

}
