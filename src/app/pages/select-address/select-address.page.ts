import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';


@Component({
  selector: 'app-select-address',
  templateUrl: './select-address.page.html',
  styleUrls: ['./select-address.page.scss'],
})
export class SelectAddressPage implements OnInit {

  radioState: string;
  radioOnImage: string = 'assets/images/Icon Radio On.png';
  radioOffImage: string = 'src/assets/images/Icon Radio Off.png';

  async openActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Delete Address',
      subHeader: 'Are you sure?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
          cssClass: 'custom-action-sheet-button'
        },
        {
          text: 'Confirm',
          handler: () => {
            console.log('Confirm clicked');
            // Add your confirm logic here
          },
          cssClass: 'custom-action-sheet-button'
        },
      ],
      cssClass: 'custom-action-sheet' 
    });

    await actionSheet.present();
  }

  constructor(public actionSheetController: ActionSheetController) {
    this.radioState = 'on';
   }

  ngOnInit() {
  }

}
