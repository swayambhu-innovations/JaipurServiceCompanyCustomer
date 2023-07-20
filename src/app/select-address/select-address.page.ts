import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {

  constructor(private router:Router) { }
  newAddress(){
    this.router.navigate(['new-address'])
  }

  ngOnInit() {
  }

  Address = [
    {
      profile: "Arpita",
      number: "9125332151",
      Addres: "4517 Washington Ave. Manchester, Kentucky 39495"
    },
    {
      profile: "Arpita",
      number: "9125332151",
      Addres: "4517 Washington Ave. Manchester, Kentucky 39495"
    },
  ]
}
