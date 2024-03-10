import { Component, OnInit } from "@angular/core";
import { ContactService } from "./contact.service";
import { DataProviderService } from "src/app/core/data-provider.service";

@Component({
    selector: 'app-contact-us',
    templateUrl: './contact-us.page.html',
    styleUrls: ['./contact-us.page.scss']
})

export class ContactUsPage implements OnInit {
    public contacts: any;
    deviceinfo: any;
    isModalOpen: boolean = false;
    mobileView: boolean = false;
    constructor(
        public contactService: ContactService,
        public dataProvider: DataProviderService,
    ) { }

    async ngOnInit() {
        this.contacts = await this.contactService.getCustomerContact();
    }

    systeminfo() {
        if (this.dataProvider.deviceInfo.deviceType === "desktop") {
            this.isModalOpen = true;
            this.mobileView = false;
        }
        if (this.dataProvider.deviceInfo.deviceType === "mobile") {
            this.mobileView = true;
            this.isModalOpen = false;
        }
    }
}