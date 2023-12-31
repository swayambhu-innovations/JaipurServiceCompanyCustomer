import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.page.html',
    styleUrls: ['./navbar.page.scss']
})

export class NavbarPage implements OnInit {
    temp1:any;
    temp2:any;
    temp3:any;
    temp4:any;
    constructor(
        public router : Router
    ){}
    ngOnInit(){
        console.log(this.router.url);
    }
}