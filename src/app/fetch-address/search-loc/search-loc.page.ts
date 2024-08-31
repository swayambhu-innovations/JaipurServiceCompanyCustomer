import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  recentSearches: any[] = [];
  serviceList: any[] = [];
  mobileView: boolean = false;
  fuseSearchInstance = new Fuse(this.serviceList, {
    keys: ['name', 'variants.name'],
    includeScore: true,
    minMatchCharLength: 3,
  });
  center:any;

  results: any[] = [];
  inputSearchVar: string = '';
  resultsFetched: boolean = false;
  areaSearchList$!: Observable<any>;

  constructor(
    private dataProvider: DataProviderService,
    private router: Router,
    public nav: NavController,
    public activatedRoute: ActivatedRoute
  ) {
    this.searchInputSubject
      .pipe(debounceTime(600))
      .subscribe((term: string) => {
        this.results = [];
        if (term.length > 2) {
          const geocoder = new google.maps.Geocoder();
          geocoder
            .geocode({
              address: term,
              componentRestrictions: {
                country: 'IN',
              },
            })
            .then((res) => {
              const { results } = res;
              this.results = [...results];
              this.results.forEach((area) => {
                area.geometry.location = area.geometry.location.toJSON();
              });
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

  ionViewDidEnter() {
    this.systemInfo();
    this.activatedRoute.params.subscribe((params) => {
      if (params) {
        this.center = params
      }
    });
    this.recentSearches.length = 0;
    this.resultsFetched = false;
    let recentLoc = localStorage.getItem('recent-loc');
    if (recentLoc) this.recentSearches = [...JSON.parse(recentLoc)];
  }
  
  systemInfo() {
    if (this.dataProvider.deviceInfo.deviceType === 'desktop') {
      this.mobileView = false;
    } else if (this.dataProvider.deviceInfo.deviceType === 'mobile') {
      this.mobileView = true;
    }
  }

  currLoc() {
    this.dataProvider.currLoc = true
    this.router.navigate(['/fetch-address']);
  }

  deleteLoc(selectedArea: any) {
    this.recentSearches = this.recentSearches.filter((area) => {
      return area.place_id !== selectedArea.place_id;
    });
  }

  sendLoc(selectedArea: any) {
    const coord = selectedArea.geometry.location;
    this.recentSearches.push(selectedArea);
    this.recentSearches = this.recentSearches.filter(
      (value, index, self) =>
        index === self.findIndex((t) => t.place_id === value.place_id)
    );
    localStorage.removeItem('recent-loc');
    localStorage.setItem('recent-loc', JSON.stringify(this.recentSearches));
    this.router.navigate(['/fetch-address/gps-map', coord]);
  }

  ionViewWillLeave() {
    localStorage.removeItem('recent-loc');
    localStorage.setItem('recent-loc', JSON.stringify(this.recentSearches));
    this.results = [];
    this.recentSearches = [];
    this.resultsFetched = false;
    this.inputSearchVar = '';
  }

  ngOnInit() {}

  goBack() {
    this.router.navigate(['/fetch-address/gps-map', this.center]);
  }
}
