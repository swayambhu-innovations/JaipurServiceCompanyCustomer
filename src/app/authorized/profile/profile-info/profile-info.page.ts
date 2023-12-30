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
  name = '';
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
    dateofbirth:  ['',[ Validators.required]]
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
      if(param.from === "profile"){
        this.userData =  this.dataProvider.currentUser?.userData;
        this.name = this.userData.name;
        this.userProfileForm.patchValue(this.userData);
        this.selectedGender = this.userData.gender;
        if(this.userData.dateofbirth){
          let datearray = this.userData.dateofbirth?.split("-");
          let newdate = datearray[0] + '-' + datearray[1] + '-' + datearray[2];
          let date = new DatePipe('en-US').transform(this.userData.dateofbirth, 'yyyy-MM-dd');
          this.userProfileForm.controls.dateofbirth.setValue(newdate)
        }
        else{
          let date = new Date().toISOString();
          this.userProfileForm.controls.dateofbirth.setValue(date)
        }
        
        
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
    this.route.navigate(['authorized/profile'])
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
      if(this.dataProvider?.currentUser?.user.uid === undefined){
        this.profileService.addUsers(this.dataProvider.currentUser!.user.uid, this.userProfileForm.value).then(()=>{
          // this.route.navigateByUrl('/authorized/select-address');
         // this.userProfileForm.reset()
           loader.dismiss()
        }).catch((error:any)=>{
          console.log(error)
        }).finally(()=>
        loader.dismiss()
        );
      }else{
          this.profileService.editUsers(this.dataProvider.currentUser!.user.uid,this.dataProvider.currentUser?.userData.uid ,this.userProfileForm.value).then(()=>{
            this.auth.updateUserDate();
            // this.route.navigateByUrl('/authorized/select-address');
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