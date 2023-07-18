import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.component.html',
  styleUrls: ['./select-address.component.scss'],
})
export class SelectAddressComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

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
