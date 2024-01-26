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

  ngOnInit() {
    
  }

}
