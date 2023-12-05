import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  ActivatedRoute, Router } from '@angular/router';
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
  name = 'Profile';
  name2 = '';
  userData:any;
  fromDate :any;
  inputValue: string = '';
  updateText: string = 'Update';
  isSubmitForm:boolean = false;
  isFromProfile:boolean = false;
  selectedGender: string = '';
  isGenderSelected:boolean = false;
  isFocused: boolean = false;
  constructor(private actionSheetController: ActionSheetController,private route:Router,public dataProvider:DataProviderService, 
    private loadingController: LoadingController, private profileService:ProfileService, public formBuilder: FormBuilder,
    private activeRoute:ActivatedRoute, private auth:AuthService) {
     
  }
  userProfileForm:FormGroup = this.formBuilder.group({
    name: ['',[ Validators.required,Validators.minLength(3)]],
    dob:  ['',[ Validators.required]]
    // agentGender: new FormControl('', Validators.required)
  })
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
    this.activeRoute.queryParams.subscribe((param:any)=>{
        console.log("params........: ", param)
      if(param.from === "profile"){
        console.log("params........: ", param)
        this.userData =  this.dataProvider.currentUser?.userData;
        this.userProfileForm.patchValue(this.userData);
        this.selectedGender = this.userData.gender;
        let datearray = this.userData.dob.split("/");
        let newdate = datearray[1] + '/' + datearray[0] + '/' + datearray[2];
        let date = new DatePipe('en-US').transform(this.userData.dob, 'MM/dd/yyyy');
        console.log("..............: ",this.userData,new Date(newdate))
        this.fromDate =newdate;
        this.userProfileForm.controls.dob.setValue(newdate)
        this.isFromProfile = true;
      }else{
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
  async nextFunction(){
    this.isSubmitForm = true;
    if(!this.userProfileForm.valid){
      if(this.selectedGender === ''){
        this.isGenderSelected = false;
        return;
      }else{
        this.isGenderSelected = true;
      }
      return;
    }
    if(this.selectedGender === ''){
      this.isGenderSelected = false;
      return;
    }else{
      this.isGenderSelected = true;
    }
    if(this.selectedGender !== ''){
      this.userProfileForm.addControl("gender", new FormControl(this.selectedGender));
    }
   
     let loader = await this.loadingController.create({message:'Adding Coustomer Details.........'})
      await loader.present()
      if(!this.isFromProfile){
        this.profileService.addCostomer(this.dataProvider.currentUser!.user.uid, this.userProfileForm.value).then(()=>{
          this.route.navigateByUrl('/authorized/home');
         // this.userProfileForm.reset()
           loader.dismiss()
        }).catch((error:any)=>{
          console.log(error)
        }).finally(()=>
        loader.dismiss()
        );
      }else{
          console.log("this.userProfileForm.value. ..: ",this.userProfileForm.value)
          this.profileService.editCostomer(this.dataProvider.currentUser!.user.uid,this.dataProvider.currentUser?.userData.profileId ,this.userProfileForm.value).then(()=>{
            this.auth.updateUserDate();
            this.route.navigateByUrl('/authorized/home');
           // this.userProfileForm.reset()
             loader.dismiss()
          }).catch((error:any)=>{
            console.log(error)
          }).finally(()=>
          loader.dismiss()
          );
      }
   
      console.log("Dismissed");
    }
}