import { Component, EventEmitter, Input, OnInit,Output } from '@angular/core';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.scss'],
})
export class RateComponent implements OnInit {
  @Output() starEvent= new EventEmitter<number>();
  @Input() isSelected!:boolean;

  emitter(){
    this.starEvent.emit(this.selectedValue);
  }

  stars: number[] = [1, 2, 3, 4, 5];


  selectedValue: number = 0;
  isMouseover = true;
  public data: any;
  
  constructor() { }
  
  
  ngOnInit(): void {
    console.log(this.stars);
    console.log(this.selectedValue);
    this.emitter();
  }
  
  
  countStar(star: number) {
    this.isMouseover = false;
    this.selectedValue = star;
    this.data = this.selectedValue;
    console.log(this.data);
    this.emitter();
  }
  
  
  addClass(star: number) {
    if (this.isMouseover) {
      this.selectedValue = star;
      console.log(this.selectedValue);
      this.emitter();
    }
  }
  
  
  removeClass() {
    if (this.isMouseover) {
      this.selectedValue = 0;
      console.log(this.selectedValue);
      this.emitter();
    }
  }

}
