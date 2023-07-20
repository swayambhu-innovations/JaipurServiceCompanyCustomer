import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.page.html',
  styleUrls: ['./all-categories.page.scss'],
})
export class AllCategoriesPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  AllCategories = [
    {
      label: "Appliance Repair",
      img: "/assets/Ellipse 208.png"
    },
    {
      label: "Bathroom Cleaning",
      img: "/assets/Group 34260.png",
    
    },
    {
      label: "Kitchen Cleaning",
      img: "/assets/Group 34261.png"
    },
    {
      label: "Full Home Cleaning",
      img: "/assets/Group 34260 (1).png"
    },
    {
      label: "Sofa carpet Cleaning",
      img: "/assets/Group 34260 (2).png"
    },
    {
      label: "Women Spa & Salon",
      img: "/assets/Group 34260 (3).png"
    },
    {
      label: "Car Cleaning",
      img: "/assets/Group 34260 (4).png"
    },

    {
      label: "Water Tank Cleaning",
      img: "/assets/Group 34260 (5).png"
    }
  ]
}
