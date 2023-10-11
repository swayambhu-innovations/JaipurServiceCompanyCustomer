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
  serviceList:Service[] = []
  fuseSearchInstance = new Fuse(this.serviceList,{
    keys:["name","variants.name" , ],
    includeScore: true,
  })
  results:searchResult[] = [];
  resultsFetched:boolean = false;
  historyTerms:string[] = [];
  constructor(private dataProvider:DataProviderService) {
    this.searchInputSubject.pipe(debounceTime(600)).subscribe((term:string)=>{
      this.results = this.fuseSearchInstance.search(term).map((result)=>{
        return {
          ...result.item,
          price:result.item.variants.sort((a,b)=>a.price-b.price)[0].price
        }
      })
      console.log("searching for ",term,this.fuseSearchInstance, this.results);
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
    this.dataProvider.mainCategories.subscribe((mainCategory)=>{
      let services:Service[] = []
      mainCategory.forEach((mainCategory)=>{
        mainCategory.subCategories.forEach((subCategory:SubCategory)=>{
          subCategory.services.forEach((service:Service)=>{
            services.push({...service})
          })
        })
      });
      this.fuseSearchInstance.setCollection(services)
      console.log("fuse search instance",this.fuseSearchInstance);
      this.serviceList = services;
    });
  }

  saveToHistory(term:string){
    if (term.length <= 0) return
    if (this.historyTerms.includes(term)) return
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
    return data.terms.reverse();
  }

  removeItemFromHistory(index:number){
    let data = JSON.parse(localStorage.getItem('searchedTerms') || '{}')
    data.terms.splice(index,1)
    localStorage.setItem('searchedTerms',JSON.stringify(data))
    this.historyTerms = this.getFromHistory();
  }

  clearHistory(){
    localStorage.setItem('searchedTerms',JSON.stringify({terms:[]}))
    this.historyTerms = this.getFromHistory();
  }

}

interface searchResult extends Service {
  price:number
}