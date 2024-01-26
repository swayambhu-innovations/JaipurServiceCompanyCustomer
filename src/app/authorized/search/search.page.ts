import { Component, OnInit } from '@angular/core';


import { Subject, debounceTime } from 'rxjs';
import Fuse from 'fuse.js'
import { DataProviderService } from '../../core/data-provider.service';
import { Service, SubCategory } from '../../core/types/category.structure';
import { Router } from '@angular/router';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss']

})
export class SearchPage implements OnInit {
  private storage = 'Storage';
  searchInputSubject:Subject<string> = new Subject<string>()

  serviceList:Service[] = []
  fuseSearchInstance = new Fuse(this.serviceList,{
    keys:["name","variants.name"],
    includeScore: true,
    minMatchCharLength : 3
  })

  results:searchResult[] = [];
  resultsFetched:boolean = false;
  historyTerms:string[] = [];
  inputSearchVar:string = "";
 
  constructor(private dataProvider:DataProviderService, private route:Router) {
    this.searchInputSubject.pipe(debounceTime(600)).subscribe((term:string)=>{
      this.results = [];
      if(term.length > 2){
        this.results = this.fuseSearchInstance.search(term).map((result)=>{
        
          return {
            ...result.item,
            price:result.item.variants.sort((a,b)=>a.price-b.price)[0]?.price
          }
        })
       
        if(this.results.length === 0 ){
          this.historyTerms = [];
        }else{
          this.saveToHistory(term);
          this.historyTerms = this.getFromHistory();
        }
        this.resultsFetched = true;
      }
      
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
  openService(service:any){
    let mainCatId = "";
    let subCatId = "";
    this.dataProvider.mainCategories.subscribe((mainCategory)=>{
        mainCategory.forEach((mainCategory)=>{
          mainCatId = mainCategory.id;
          let subCat = mainCategory.subCategories.filter((subCategory:SubCategory)=>{
            let serviceFind =   subCategory.services.filter(serviced=> serviced.id === service.id);
            return serviceFind.length > 0 ? true: false;
          });
          if(subCat.length > 0){
            subCatId = subCat[0].id;
          }
        });
        if(mainCatId && subCatId){
          this.route.navigate(['/authorized/service-detail/'+mainCatId+'/'+subCatId+'/'+service.id]);
        }
        
    });
      
  }
  getFromHistory():string[]{
    let data = JSON.parse(localStorage.getItem('searchedTerms') || '{}');
    if (typeof data.terms == 'object' && data.terms.length >= 0) {
    return data.terms.reverse();
    }else{
      return [];
    }
  }
  removeItemFromHistory(index:number){
    
    let data = JSON.parse(localStorage.getItem('searchedTerms') || '{}')
    data.terms.splice(index,1)
    localStorage.setItem('searchedTerms',JSON.stringify(data))
    this.historyTerms = this.getFromHistory();
  }

  clearHistory(){
    this.results = [];
    this.inputSearchVar = "";
    localStorage.setItem('searchedTerms',JSON.stringify({terms:[]}))
    this.historyTerms = this.getFromHistory();
  }
    
  }


interface searchResult extends Service {
  price:number
}