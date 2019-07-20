import { Component, Injector } from '@angular/core';

import { CategoryModel } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import {BaseResourceListComponent} from '../../../shared/components/base-resource-list/base-resource-list.component';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent extends BaseResourceListComponent<CategoryModel> {

  constructor(
    private categoryService: CategoryService,
    private injector: Injector
  ) {
    super(categoryService);
  }
}
