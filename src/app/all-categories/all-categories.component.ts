import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss'],
})
export class AllCategoriesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}
  AllCategories=[
    {
      label:"Appliance Repair"
    },
    {
      label:"Bathroom Cleaning"
    },
    {
      label:"Kitchen Cleaning"
    },
    {
      label:"Full Home Cleaning"
    },
    {
      label:"Sofa carpet Cleaning"
    },
    {
      label:"Women Spa & Salon"
    },
    {
      label:"Car Cleaning"
    },
    
    {
      label:"Water Tank Cleaning"
    }
  ]
}
