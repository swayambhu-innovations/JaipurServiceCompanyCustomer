import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {

isModalOpen = false;

setOpen(isOpen: boolean) {
  this.isModalOpen = isOpen;
}

  radioState: string;
  radioOnImage: string = 'assets/images/Icon Radio On.png';
  radioOffImage: string = 'src/assets/images/Icon Radio Off.png';

  constructor() {
    this.radioState = 'on';
   }

  ngOnInit() {
  }

}
