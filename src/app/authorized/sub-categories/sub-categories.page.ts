import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataProviderService } from 'src/app/core/data-provider.service';
import { Category, SubCategory } from 'src/app/core/types/category.structure';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-sub-categories',
  templateUrl: './sub-categories.page.html',
  styleUrls: ['./sub-categories.page.scss'],
})
export class SubCategoryPage implements OnInit {
  matchingMainCategory: Category | undefined;
  subCategory: SubCategory[] = [];
  mainCategoryId = "";
  constructor(
    private dataProvider: DataProviderService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.activatedRoute.params.subscribe(async (params) => {
      let mainCategories = await firstValueFrom(
        this.dataProvider.mainCategories
      );
      this.mainCategoryId = params['mainCategoryId'];
      this.matchingMainCategory = mainCategories.find(
        (mainCategory) => mainCategory.id == params['mainCategoryId']
      );
      if (this.matchingMainCategory === undefined) {
        this.router.navigate(['/home']);
        return;
      }
      this.subCategory = this.matchingMainCategory.subCategories;
    });
  }
  
  ngOnInit(): void {}
}
