import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataProviderService } from "src/app/core/data-provider.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.page.html',
    styleUrls: ['./navbar.page.scss']
})

export class NavbarPage implements OnInit {
    hasProfileSaved: boolean = false;
    constructor(
        public router : Router,
        public dataProvider: DataProviderService,
    ){}
    ngOnInit(){
        this.dataProvider.currentUser$.subscribe((user) => {
            this.hasProfileSaved = user?.userData?.name ? true : false;
        })
    }
    close(url:any) {
        this.router.navigate([url]);
    }

    getBookingDetailUrl(a,b){
        return a.indexOf(b) > -1;
    }
}


// showHeader:boolean = true;
    // constructor(private dataProviderService:DataProviderService){}
    // ngOnInit(){
    //     this.dataProviderService.isFirstTime.subscribe((isFirstTime:boolean)=>{
    //         this.showHeader = isFirstTime;
    //     })
    // }