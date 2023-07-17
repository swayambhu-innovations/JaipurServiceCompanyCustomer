import { Component, OnInit } from '@angular/core';
import SwiperCore, {
  Autoplay,
  EffectFade,
  Swiper,
  SwiperOptions,
} from 'swiper';
import { AutoplayOptions } from 'swiper/types';

// install Swiper modules
SwiperCore.use([EffectFade, Autoplay]);

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  autoplayOptions:AutoplayOptions = {
    delay: 5000, 
  }

  promotionalBanners:bannerConfig[] = [
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com'
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com'
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com'
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com'
    },
    {
      image: 'assets/banners/dealSlide1.svg',
      url: 'https://www.google.com'
    },
  ]

  slideConfig:SwiperOptions = {
    spaceBetween: 30,
  }

  constructor() { }

  ngOnInit() {
  }

}

interface bannerConfig {
  image:string;
  url:string;
}
// dealSlide1.svg