import { Component, OnInit } from '@angular/core';
import { Subject, debounceTime } from 'rxjs';
import Fuse from 'fuse.js'
import { DataProviderService } from '../../core/data-provider.service';
import { Service, SubCategory } from '../../core/types/category.structure';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  searchInputSubject:Subject<string> = new Subject<string>()
  serviceList:service[] = [
    {
      name:"Room cleaning service",
      image:"https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=900&q=60",
      id:"1",
      tags:["room, cleaning, service"],
      description:"Service cleaning room for you and your family.",
      price:2300
    },
    {
      name:"Room cleaning service",
      image:"https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=900&q=60",
      id:"1",
      tags:["room, cleaning, service"],
      description:"Service cleaning room for you and your family.",
      price:2300
    },
    {
      name:"Room cleaning service 1",
      image:"https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=900&q=60",
      id:"1",
      tags:["room, cleaning, service"],
      description:"Service cleaning room for you and your family.",
      price:2300
    },
    {
      name:"Terrace cleaning service 2",
      image:"https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=900&q=60",
      id:"1",
      tags:["Terrace, cleaning, service"],
      description:"Service cleaning Terrace for you and your family.",
      price:3432,
    },
    {
      name:"Kitchen cleaning service 3",
      image:"https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cm9vbXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=900&q=60",
      id:"1",
      tags:["Kitchen, cleaning, service"],
      description:"Service cleaning Kitchen for you and your family.",
      price:5000,
    },
  ]
  fuseSearchInstance = new Fuse(this.serviceList,{
    keys:["name","tags","description","price" , ],
    includeScore: true,
  })
  results:service[] = [];
  resultsFetched:boolean = false;
  historyTerms:string[] = [];
  constructor(private dataProvider:DataProviderService) {
    this.searchInputSubject.pipe(debounceTime(600)).subscribe((term:string)=>{
      this.results = this.fuseSearchInstance.search(term).map((result)=>{
        return result.item
      })
      this.saveToHistory(term);
      this.historyTerms = this.getFromHistory();
      this.resultsFetched = true;
    })
  }

  ionViewDidLoad(){
    this.resultsFetched = false
  }

  ngOnInit() {
    this.historyTerms = this.getFromHistory();
    let services:Service[] = []
    this.dataProvider.mainCategories.subscribe((mainCategory)=>{
      mainCategory.forEach((mainCategory)=>{
        mainCategory.subCategories.forEach((subCategory:SubCategory)=>{
          services.concat(subCategory.services)
        })
      })
    });
  }

  saveToHistory(term:string){
    if (term.length <= 0) return
    // get searched terms history array from local storage
    // add new term to array
    // save array to local storage
    let data = JSON.parse(localStorage.getItem('searchedTerms') || '{}')
    if (typeof data.terms == 'object' && data.terms.length >= 0) {
      data.terms.push(term)
      localStorage.setItem('searchedTerms',JSON.stringify(data))
    } else {
      localStorage.setItem('searchedTerms',JSON.stringify({terms:[term]}))
    }
  }

  getFromHistory():string[]{
    let data = JSON.parse(localStorage.getItem('searchedTerms') || '{}')
    return data.terms
  }

  removeItemFromHistory(index:number){
    let data = JSON.parse(localStorage.getItem('searchedTerms') || '{}')
    data.terms.splice(index,1)
    localStorage.setItem('searchedTerms',JSON.stringify(data))
    this.historyTerms = this.getFromHistory();
  }

}

interface service {
  name:string;
  image:string;
  id:string;
  tags:string[];
  description:string;
  price:number;
}
