import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ContactUsPage } from "./contact-us.page";
import { ContactUsRoutingModule } from "./contact-us-routing.module";
import { WidgetsModule } from "src/app/widgets/widgets.module";

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ContactUsRoutingModule,
        WidgetsModule
    ],

    declarations: [ContactUsPage]
})

export class ContactUsModule{
    
}