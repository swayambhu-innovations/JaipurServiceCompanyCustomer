import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.page.html',
  styleUrls: ['./profile-info.page.scss'],
})
export class ProfileInfoPage implements OnInit {
  name = 'Profile';
  name2 = 'Arpita Mehta';
  inputValue: string = '';
  updateText: string = 'Update';
  selectedGender: string = '';
  isFocused: boolean = false;
  constructor(private actionSheetController: ActionSheetController) {
    name2: 'Arpita Mehta';
  }
  onUpdateText() {
    // Replace this with your own logic to set the updateText
    this.updateText = 'Updated!';
  }
  onFocus() {
    this.isFocused = true;
  }

  onBlur() {
    this.isFocused = false;
  }
  ngOnInit() {}
  // Click to select male and female
  async openGenderPicker() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Gender',
      buttons: [
        {
          text: 'Male',
          handler: () => {
            this.selectedGender = 'Male';
          },
        },
        {
          text: 'Female',
          handler: () => {
            this.selectedGender = 'Female';
          },
        },
      ],
    });

    await actionSheet.present();
  }
}
