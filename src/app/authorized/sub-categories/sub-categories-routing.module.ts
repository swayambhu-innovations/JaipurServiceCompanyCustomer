import {NgModule} from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubCategoryPage } from './sub-categories.page';

const routes: Routes =[
    {
        path: '',
        component: SubCategoryPage
    }
]
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class SubCategoryPageRoutingModule {}