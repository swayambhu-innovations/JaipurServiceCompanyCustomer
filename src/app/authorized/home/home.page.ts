import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import SwiperCore, {
  Autoplay,
  EffectFade,
  Swiper,
  SwiperOptions,
} from 'swiper';
import { AutoplayOptions } from 'swiper/types';
import { HomeService } from './home.service';

// install Swiper modules
SwiperCore.use([EffectFade, Autoplay]);

interface bannerConfig {
  image: string;
  url: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  autoplayOptions: AutoplayOptions = {
    delay: 5000,
  };

  promotionalBanners: bannerConfig[] = [
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com',
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com',
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com',
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com',
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com',
    },
  ];

  slideConfig: SwiperOptions = {
    spaceBetween: 30,
  };

  banners: any[] = [];

  constructor(private router: Router, public homeService: HomeService) {
  }

  ngOnInit() {
    this.fetchBanners();
  }

  fetchBanners() {
    this.homeService.getBanners().then((images) => {
      this.banners = images.docs.map((doc) => {
        return doc.data()
      });
    });
  }
  cart() {
    this.router.navigate(['cart']);
  }

  booking() {
    this.router.navigate(['booking']);
  }

  home() {
    this.router.navigate(['home']);
  }
  notification() {
    this.router.navigate(['notification']);
  }

  // dealSlide1.svg

  condition: boolean = true;
  prevText: string = '';
  // programmingLanguages: any[] = ['java', 'c++',
  //     'python', 'c', 'javascript'];
  res_list = [];
  res_cnt: number = 0;
  public searchInput!: any;
  public programmingLanguages: Array<any> = [
    'Python',
    'TypeScript',
    'C',
    'C++',
    'Java',
    'Go',
    'JavaScript',
    'PHP',
    'Ruby',
    'Swift',
    'Kotlin',
  ];

  Cleaning = [
    {
      label: 'Kitchen Cleaning',
      img: '/assets/Mask Group.png',
    },
    {
      label: 'Deep House Clean',
      img: '/assets/Mask Group (1).png',
    },
    {
      label: 'Deep House Clean',
      img: '/assets/Mask Group.png',
    },
  ];
  ACRepair = [
    {
      label: 'AC Deep Cleaning',
      img: '/assets/Group 34037.png',
    },
    {
      img: '/assets/Mask Group (2).png',
      label: 'Noise/Smell Issues',
    },
    {
      label: 'Noise/Smell Issues',
      img: '/assets/Group 34037.png',
    },
  ];
  BathroomCleanings = [
    {
      label: 'Monthly Cleaning',
      img: '/assets/Group 34037 (1).png',
    },
    {
      label: 'Quarterly Cleaning',
      img: '/assets/Mask Group (3).png',
    },
    {
      label: 'Quarterly Cleaning',
      img: '/assets/Mask Group (3).png',
    },
  ];

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

export interface Banner {
  id?: string|null|undefined;
  title: string|null|undefined;
  bannerUrl: string|null|undefined;
  start: string|null|undefined;
  end: string|null|undefined;
  img: string;
  bannerNo?: number|null|undefined;
}
