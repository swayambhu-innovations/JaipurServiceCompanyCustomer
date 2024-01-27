import { RouterModule, Routes } from "@angular/router";
import { FaqComponent } from "./faq.component";
import { NgModule } from "@angular/core";

const routes : Routes=[
    {
        path:'',
        component:FaqComponent
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })

export class FaqRoutingModule{}  