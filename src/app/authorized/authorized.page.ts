import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../core/data-provider.service';

@Component({
  selector: 'app-authorized',
  templateUrl: './authorized.page.html',
  styleUrls: ['./authorized.page.scss'],
})
export class AuthorizedPage implements OnInit {
  isPageLoaded: string = "";
  constructor(private dataProvider: DataProviderService) {
    this.dataProvider.isPageLoaded$.subscribe((isPageLoaded) =>{
      if(isPageLoaded == "loaded"){
        this.isPageLoaded = isPageLoaded;
      }
    })
  }

  images: string[] = ['relax1.svg','Delivery-amico.svg','Product teardown-bro.svg']
  currentImageIndex: number = 0;
  interval: any;

  ngOnInit() {
    // Start the interval when the component is initialized
    this.startInterval();
  }

  ngOnDestroy() {
    // Clear the interval when the component is destroyed
    clearInterval(this.interval);
  }

  startInterval() {
    // Set the interval to change images every 5 seconds
    this.interval = setInterval(() => {
      this.nextImage();
    }, 2000);
  }

  nextImage() {
    // Move to the next image in the array
    this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
  }


}
