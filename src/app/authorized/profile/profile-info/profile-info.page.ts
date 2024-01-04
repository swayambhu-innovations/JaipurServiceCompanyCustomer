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
  photoUrl: any;
  urlparam: string = '';

  constructor(
    private actionSheetController: ActionSheetController,
    private route: Router,
    public dataProvider: DataProviderService,
    private loadingController: LoadingController,
    private profileService: ProfileService,
    public formBuilder: FormBuilder,
    private activeRoute: ActivatedRoute,
    public auth: AuthService
  ) {
    console.log(this.dataProvider.currentUser?.userData);
  }

  userProfileForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    dateofbirth: ['', [Validators.required]],
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

  ngOnInit() {
    this.activeRoute.queryParams.subscribe((param: any) => {
      this.urlparam = param.from;
      if (param.from === 'profile') {
        this.userData = this.dataProvider.currentUser?.userData;
        this.name = this.userData.name;
        this.userProfileForm.patchValue(this.userData);
        this.selectedGender = this.userData.gender;
        if(this.userData.dateofbirth){
          let datearray = this.userData.dateofbirth?.split("/");
          let newdate = datearray[0] + '-' + datearray[1] + '-' + datearray[2];
          let date = new DatePipe('en-US').transform(newdate, 'yyyy-MM-dd');
          this.userProfileForm.controls.dateofbirth.setValue(date)
        }
        else{
          this.userProfileForm.controls.dateofbirth.setValue('yyyy-MM-dd')
        }


        this.isFromProfile = true;
      } else {
        this.isFromProfile = false;
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

  async nextFunction() {
    let date = "";
    if (this.userProfileForm.controls.dateofbirth.value && this.userProfileForm.controls.dateofbirth.value !== '') {
      date = this.userProfileForm.controls.dateofbirth.value.split('-');
      date = date[2] + '/' + date[1] + '/' + date[0];
    } else {
      return;
    }
    if (this.userProfileForm.controls.name.value && this.userProfileForm.controls.name.value === '') {
      return;
    }

    this.isSubmitForm = true;
    if (this.selectedGender === '') {
      this.isGenderSelected = false;
      return;
    } else {
      this.isGenderSelected = true;
    }
    let finalData = {
      gender: this.selectedGender,
      dateofbirth: date,
      name: this.userProfileForm.controls.name.value
    }
    let loader = await this.loadingController.create({
      message: 'Adding Customer Details.........',
    });

    await loader.present();
    if (this.dataProvider?.currentUser?.user.uid === undefined) {
      this.profileService
        .addUsers(
          this.dataProvider.currentUser!.user.uid,
          finalData
        )
        .then(() => {
          console.log("this.urlparam .......: ", this.urlparam)
          if (this.urlparam === 'profile') {
            this.route.navigate(['authorized/profile']);
          } else {
            this.route.navigate(['/authorized/new-address'], { state: { isEdit: false } });
          }
          // this.userProfileForm.reset()
          loader.dismiss();
        })
        .catch((error: any) => {
          console.log(error);
        })
        .finally(() => loader.dismiss());
    } else {
      this.auth.isProfileUpdated= true;
        await this.profileService
        .editUsers(
          this.dataProvider.currentUser!.user.uid,
          this.dataProvider.currentUser?.userData.uid,
          finalData
        );
        
        await this.auth.updateUserDate(false);
        loader.dismiss();
    }
    console.log('Dismissed');
  }
  ionViewDidLeave (){
    this.auth.isProfileUpdated = false;
  }

  setPhoto(event: any) {
    this.photoUrl = event.target.files[0];
    this.updateUser(this.photoUrl);
  }

  async updateUser(file: any) {
    let loader = await this.loadingController.create({
      message: 'Updating Coustomer Details.........',
    });
    loader.present();
    this.profileService.updatePic(file, this.dataProvider.currentUser!.user.uid)
      .then((url) => {
        this.userData.photoUrl = url;
        // this.auth.updateUserDate();
        // this.route.navigateByUrl('/authorized/select-address');
        // this.userProfileForm.reset()
        loader.dismiss();
      })
      .catch((error: any) => {
        console.log(error);
      })
      .finally(() => loader.dismiss());
  }
}
