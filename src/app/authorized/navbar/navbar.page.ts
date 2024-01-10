import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.page.html',
    styleUrls: ['./navbar.page.scss']
})

export class NavbarPage implements OnInit {
    
    constructor(
        public router : Router
    ){}
    ngOnInit(){
        console.log(this.router.url);
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