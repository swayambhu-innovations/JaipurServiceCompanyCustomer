import { NgModule } from "@angular/core";
import { Route, RouterModule, Routes } from "@angular/router";
import { ContactUsPage } from "./contact-us.page";

const routes: Routes = [
    {
        path: '',
        component: ContactUsPage
    }
]
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        
    ],
    exports: [RouterModule]
})

export class ContactUsRoutingModule{
    
}