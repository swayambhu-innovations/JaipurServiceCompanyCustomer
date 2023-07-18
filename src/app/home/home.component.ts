import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() { }
 
  condition: boolean = true;
  prevText: string = '';
  // programmingLanguages: any[] = ['java', 'c++', 
  //     'python', 'c', 'javascript'];
  res_list = [];
  res_cnt: number = 0;
  public searchInput!: any;
  public programmingLanguages: Array<any> = [
    'Python', 'TypeScript', 'C', 'C++', 'Java',
    'Go', 'JavaScript', 'PHP', 'Ruby', 'Swift', 'Kotlin'
  ]

  Cleaning = [
    {
      label: "Kitchen Cleaning",
      img:"/assets/Mask Group.png"
    },
    {
      label: "Deep House Clean",
      img:"/assets/Mask Group (1).png"
    },
    {
      label: "Deep House Clean",
      img:"/assets/Mask Group.png"
    }
  ]
  ACRepair = [
    {
      label: "AC Deep Cleaning",
      img:"/assets/Group 34037.png"
      
    },
    {
      img:"/assets/Mask Group (2).png",
      label: "Noise/Smell Issues"
    }, {
      label: "Noise/Smell Issues",
      img:"/assets/Group 34037.png"

    }
  ]
  BathroomCleanings = [
    {
      label: "Monthly Cleaning",
      img:"/assets/Group 34037 (1).png"
    },
    {
      label: "Quarterly Cleaning",
      img:"/assets/Mask Group (3).png"
    },
    {
      label: "Quarterly Cleaning"
      , img:"/assets/Mask Group (3).png"
    }
  ]

  onSubmit($event: KeyboardEvent) {
    if ($event.keyCode === 13) {
      this.condition = !this.condition;
        this.prevText = this.searchInput;
        this.res_cnt = 0;
        this.res_list = [];
        // setTimeout(() => {
        //     this.condition = false;
        //     for (let i = 0; i < this.programmingLanguages.length; i++) {
        //         if (this.programmingLanguages[i] === this.prevText.toLowerCase()
        //             || this.programmingLanguages[i].startsWith(this.prevText)) {
        //             this.res_cnt += 1;
        //             // this.res_list.push(this.programmingLanguages[i]);
        //         }
        //     }
        // }, 3000);
        this.searchInput = null;
    }
}
}