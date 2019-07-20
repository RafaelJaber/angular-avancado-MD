import { Component, Injector } from '@angular/core';
import { Validators } from '@angular/forms';

import { BaseResourceFormComponent } from '../../../shared/components/base-resource-form/base-resource-form.component';

import { CategoryModel } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';


@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent extends BaseResourceFormComponent<CategoryModel> {

  constructor(
    protected categoryService: CategoryService,
    protected injector: Injector
  ) {
    super(injector, new CategoryModel(), categoryService, CategoryModel.fromJson);
  }

  protected buildResourceForm(): void {
    this.resourceForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null, [Validators.required]]
    });
  }

  protected creationPageTitle(): string {
    return `Cadastro de categoria`;
  }

  protected editionPageTitle(): string {
    const categoryName: string = this.resource.name || '';
    return `Editando a categoria: ${categoryName}`;
  }
}
