import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { DataProviderService } from "src/app/core/data-provider.service";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.page.html',
    styleUrls: ['./navbar.page.scss']
})

export class NavbarPage implements OnInit {

    showHeader:boolean = true;
    constructor(private dataProviderService:DataProviderService){}
    ngOnInit(){
        this.dataProviderService.isFirstTime.subscribe((isFirstTime:boolean)=>{
            this.showHeader = isFirstTime;
        })
    }
}