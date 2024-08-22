import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { ProfileService } from '../../db_services/profile.service';
import { DatePipe } from '@angular/common';
import { AuthService } from 'src/app/core/auth.service';
import { AlertsAndNotificationsService } from 'src/app/alerts-and-notifications.service';
import * as moment from 'moment';
import { AddressService } from '../../db_services/address.service';
import { CartService } from '../../cart/cart.service';
@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.page.html',
  styleUrls: ['./profile-info.page.scss'],
})
export class ProfileInfoPage implements OnInit {
  name = '';
  name2 = '';
  userData: any;
  fromDate: any;
  inputValue: string = '';
  updateText: string = 'Update';
  isSubmitForm: boolean = false;
  isFromProfile: boolean = false;
  selectedGender: string = '';
  isGenderSelected: boolean = false;
  isFocused: boolean = false;
  photoUrl: File;
  urlparam: string = '';

  constructor(
    private actionSheetController: ActionSheetController,
    private route: Router,
    public dataProvider: DataProviderService,
    private addressService: AddressService,
    private loadingController: LoadingController,
    private profileService: ProfileService,
    public formBuilder: FormBuilder,
    public cartService: CartService,
    private activeRoute: ActivatedRoute,
    public auth: AuthService,
    private alertify: AlertsAndNotificationsService
  ) {}

  userProfileForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    // dateofbirth: [''],
    gender: [''],
    // agentGender: new FormControl('', Validators.required)
  });

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

  async ngOnInit() {
    this.dataProvider.isPageLoaded$.next('loaded');
    this.userData = this.dataProvider.currentUser?.userData;
    this.dataProvider.currentUser$.subscribe((response) => {
      this.userData = response?.userData ?? '';
    });

    if (!this.userData?.uid) {
      this.dataProvider.checkingAuth = false;
      this.dataProvider.loggedIn = false;
      this.route.navigate(['unauthorized/login']);
    }

    this.activeRoute.queryParams.subscribe(async (param: any) => {
      this.urlparam = param.from;
      if (this.userData?.name) {
        this.name = this.userData.name;
        this.userProfileForm.patchValue(this.userData);
        this.selectedGender = this.userData.gender;
        if (this.dataProvider.firstTimeLogin)
          await this.auth.updateUserDate(false);
        // if(this.userData.dateofbirth){
        //   const momentDate = moment(this.userData.dateofbirth,"DD/MM/YYYY").format("YYYY-MM-DD");
        //   this.userProfileForm.controls.dateofbirth.setValue(momentDate)
        // }
        // else{
        //   this.userProfileForm.controls.dateofbirth.setValue('YYYY-MM-DD')
        // }
      } else {
        // this.userProfileForm.controls.dateofbirth.setValue('YYYY-MM-DD')
      }
    });
  }

  // Click to select male and female
  async openGenderPicker() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Select Gender',
      buttons: [
        {
          text: 'Male',
          handler: () => {
            this.selectedGender = 'Male';
            this.userProfileForm.get('gender')?.setValue('Male');
          },
        },
        {
          text: 'Female',
          handler: () => {
            this.userProfileForm.get('gender')?.setValue('Female');
            this.selectedGender = 'Female';
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async nextFunction() {
    let date = '';
    this.isSubmitForm = true;
    // if (this.userProfileForm.controls.dateofbirth.value && this.userProfileForm.controls.dateofbirth.value !== 'YYYY-MM-DD') {
    //   date = this.userProfileForm.controls.dateofbirth.value.split('-');
    //   date = date[2] + '/' + date[1] + '/' + date[0];
    // } else {
    //   date = "DD/MM/YYYY";
    // }

    if (this.userProfileForm.controls.name.value == '') {
      return;
    }

    if (this.selectedGender === '') {
      this.isGenderSelected = false;
      //return;
    } else {
      this.isGenderSelected = true;
    }
    let finalData = {
      gender: this.userProfileForm.controls.gender.value ?? '',
      // dateofbirth: date,
      name: this.userProfileForm.controls.name.value,
      uid: this.dataProvider.currentUser?.user['uid'],
    };
    let loader = await this.loadingController.create({
      message: 'Adding Customer Details.........',
    });

    loader.present();
    console.log(this.dataProvider.currentUser);
    if (
      this.dataProvider?.currentUser?.user.uid === undefined ||
      this.dataProvider.currentUser?.userData == undefined
    ) {
      this.profileService
        .addUsers(this.dataProvider.currentUser!.userData.uid, finalData)
        .then(() => {
          console.log(this.dataProvider.currentUser);
          this.route.navigate(['/authorized/select-address']);
          this.isSubmitForm = false;
          loader.dismiss();
        })
        .catch((error: any) => {
          console.log(error);
        })
        .finally(() => loader.dismiss());
      loader.dismiss();
    } else {
      this.auth.isProfileUpdated = true;
      await this.profileService
        .editUsers(
          this.dataProvider.currentUser!.userData.uid,
          this.dataProvider.currentUser?.userData.uid,
          finalData
        )
        .then(() => {
          this.isSubmitForm = false;
          this.alertify.presentToast('Profile updated...');
        });

      await this.auth.updateUserDate(false);
      loader.dismiss();
    }
  }
  ionViewDidLeave() {
    this.auth.isProfileUpdated = false;
  }

  ionViewDidEnter() {}

  setPhoto(event: any) {
    this.photoUrl = event.target.files[0];
    this.updateUser(this.photoUrl);
  }

  async updateUser(file: File) {
    let loader = await this.loadingController.create({
      message: 'Updating Coustomer Details.........',
    });
    loader.present();
    this.profileService
      .updatePic(file, this.dataProvider.currentUser!.userData.uid)
      .then((url) => {
        this.userData.photoUrl = url;
        loader.dismiss();
      })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => loader.dismiss());
  }
}
