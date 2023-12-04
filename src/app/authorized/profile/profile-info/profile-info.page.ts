import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { ActionSheetController, LoadingController } from '@ionic/angular';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { ProfileService } from '../../db_services/profile.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-profile-info',
  templateUrl: './profile-info.page.html',
  styleUrls: ['./profile-info.page.scss'],
})
export class ProfileInfoPage implements OnInit {
  name = 'Profile';
  name2 = '';
  inputValue: string = '';
  updateText: string = 'Update';
  isSubmitForm:boolean = false;
  selectedGender: string = '';
  isGenderSelected:boolean = false;
  isFocused: boolean = false;
  constructor(private actionSheetController: ActionSheetController,private route:Router,public dataProvider:DataProviderService, 
    private loadingController: LoadingController, private profileService:ProfileService, public formBuilder: FormBuilder) {
  }
  agentForm:FormGroup = this.formBuilder.group({
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
  async nextFunction(){
    this.isSubmitForm = true;
    if(!this.agentForm.valid){
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
      this.agentForm.addControl("gender", new FormControl(this.selectedGender));
    }
    this.agentForm.patchValue({'dob':new DatePipe('en-US').transform(this.agentForm.value.agentDOB, 'dd/MM/yyyy')})
     let loader = await this.loadingController.create({message:'Adding Coustomer Details.........'})
    await loader.present()
      this.profileService.addCostomer(this.dataProvider.currentUser!.user.uid, this.agentForm.value).then(()=>{
        this.route.navigateByUrl('/authorized/home');
        this.agentForm.reset()
         loader.dismiss()
      }).catch((error:any)=>{
        console.log(error)
      }).finally(()=>
      loader.dismiss()
      );
      console.log("Dismissed");
    }
}