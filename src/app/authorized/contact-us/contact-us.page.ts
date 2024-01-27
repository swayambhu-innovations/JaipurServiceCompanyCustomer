import { Component, OnInit } from "@angular/core";
import { ContactService } from "./contact.service";

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.page.html',
    styleUrls: ['./contact-us.page.scss']
})

export class ContactUsPage implements OnInit{
    public contacts : any;
    constructor(
        public contactService : ContactService
    ){}

    async ngOnInit() {
        this.contacts = await this.contactService.getCustomerContact();
    }
}