import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rating',
  templateUrl: './rating.page.html',
  styleUrls: ['./rating.page.scss'],
})
export class RatingPage implements OnInit {
  name = 'Rating';
  stars!: number;
  isSelected: boolean = false;

  constructor(
    private router:Router
  ) { }

  ngOnInit() {
  }

  getStars(star: number) {
    this.stars = star;

  }

  selected(){
    this.isSelected = true;
    setTimeout(()=>{
      this.router.navigate(['/'])
    },3000);
  }
  

}
