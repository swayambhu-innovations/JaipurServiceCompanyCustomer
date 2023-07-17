import { Component } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor() {}
  public searchInput!: string;
    public programmingLanguages = [
      'Python','TypeScript','C','C++','Java',
      'Go','JavaScript','PHP','Ruby','Swift','Kotlin'
   ]

  Cleaning=[
    {
      label:"Kitchen Cleaning"
    },
    {
      label:"Deep House Clean"
    }
  ]
  ACRepair=[
    {
      label:"AC Deep Cleaning"
    },
    {
      label:"Noise/Smell Issues"
    }
  ]
  BathroomCleanings=[
    {
      label:"Monthly Cleaning"
    },
    {
      label:"Quarterly Cleaning"
    }
  ]
  
}
