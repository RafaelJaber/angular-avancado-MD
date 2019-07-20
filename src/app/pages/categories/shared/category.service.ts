import { Injectable, Injector } from '@angular/core';

import { CategoryModel } from './category.model';

import {BaseResourceService} from '../../../shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends BaseResourceService<CategoryModel> {

  constructor(
    protected injector: Injector
  ) {
    super('api/categories', injector, CategoryModel.fromJson);
  }
}
