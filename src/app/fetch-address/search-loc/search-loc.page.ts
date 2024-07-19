import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { debounceTime, Observable, Subject } from 'rxjs';
import Fuse from 'fuse.js';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-search-loc',
  templateUrl: './search-loc.page.html',
  styleUrls: ['./search-loc.page.scss'],
})
export class SearchLocPage implements OnInit {
  private storage = 'Storage';
  searchInputSubject: Subject<string> = new Subject<string>();

  serviceList: any[] = [];
  fuseSearchInstance = new Fuse(this.serviceList, {
    keys: ['name', 'variants.name'],
    includeScore: true,
    minMatchCharLength: 3,
  });

  results: any[] = [];
  inputSearchVar: string = '';
  resultsFetched: boolean = false;
  areaSearchList$!: Observable<any>;

  constructor(
    private dataProvider: DataProviderService,
    private router: Router,
    public nav: NavController
  ) {
    this.searchInputSubject
      .pipe(debounceTime(600))
      .subscribe((term: string) => {
        this.results = [];
        if (term.length > 2) {
          const geocoder = new google.maps.Geocoder();
          geocoder
            .geocode({ address: term })
            .then((res) => {
              const { results } = res;
              this.results = [...results];
              this.resultsFetched = true;
            })
            .catch((err) => {
              this.results.length = 0;
              this.resultsFetched = true;
            });
        }
        if (term.length == 0) {
          this.resultsFetched = false;
          this.results.length = 0;
        }
      });
  }

  ionViewDidLoad() {
    this.resultsFetched = false;
  }

  currLoc() {
    this.router.navigate(['/fetch-address']);
  }

  sendLoc(selectedArea: any) {
    let coord = selectedArea.geometry.location.toJSON();
    this.router.navigate(['/fetch-address/gps-map', coord]);
  }

  ionViewWillLeave() {
    this.results = [];
    this.resultsFetched = false;
    this.inputSearchVar = '';
  }

  ngOnInit() {
    this.dataProvider.mainCategories.subscribe((mainCategory) => {
      let areas: any[] = [];

      this.fuseSearchInstance.setCollection(areas);
      this.serviceList = areas;
    });
  }

  goBack() {
    this.router.navigateByUrl('fetch-address');
  }

  saveToHistory(term: string) {
    if (term.length <= 0) return;
    let data = JSON.parse(localStorage.getItem('searchedTerms') || '{}');
    if (typeof data.terms == 'object' && data.terms.length >= 0) {
      data.terms.push(term);
      localStorage.setItem('searchedTerms', JSON.stringify(data));
    } else {
      localStorage.setItem('searchedTerms', JSON.stringify({ terms: [term] }));
    }
  }

  openService(service: any) {
    let subCatId = '';

    this.dataProvider.mainCategories.subscribe((mainCategory) => {
      mainCategory.forEach((mainCategory) => {
        let subCat = mainCategory.subCategories.filter((subCategory: any) => {
          let serviceFind = subCategory.services.filter(
            (serviced) => serviced.id === service.id
          );
          return serviceFind.length > 0 ? true : false;
        });
        if (subCat.length > 0) {
          subCatId = subCat[0].id;
        }
      });
      if (service?.mainCatId && subCatId) {
        this.router.navigate([
          '/authorized/service-detail/' +
            service?.mainCatId +
            '/' +
            subCatId +
            '/' +
            service.id,
        ]);
      }
      this.resultsFetched = false;
    });
  }
  getFromHistory(): string[] {
    let data = JSON.parse(localStorage.getItem('searchedTerms') || '{}');
    if (typeof data.terms == 'object' && data.terms.length >= 0) {
      return data.terms.reverse();
    } else {
      return [];
    }
  }
  removeItemFromHistory(index: number) {
    let data = JSON.parse(localStorage.getItem('searchedTerms') || '{}');
    data.terms.splice(index, 1);
    localStorage.setItem('searchedTerms', JSON.stringify(data));
  }
}
