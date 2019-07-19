import {AfterContentChecked, Component, OnInit} from '@angular/core';

import { CategoryModel } from '../shared/category.model';
import {CategoryService} from '../shared/category.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  categoryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  // @ts-ignore
  category: CategoryModel = new CategoryModel();

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildCategoryForm();
    this.loadCategory();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createCategory();
    } else {
      this.updateCategory();
    }
  }

  // PRIVATE METHODS


  private setCurrentAction(): void {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  private buildCategoryForm(): void {
    this.categoryForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null, [Validators.required]]
    });
  }

  private loadCategory(): void {
    if (this.currentAction === 'edit') {

      this.route.paramMap.pipe(
        switchMap(params => this.categoryService.getById(+params.get('id')))
      )
        .subscribe((category: CategoryModel) => {
            this.category = category;
            this.categoryForm.patchValue(category); // binds loader category data to CategoryForm
          },
          (error) => {
            alert(`Ocorreu um erro ao realizar a tarefa`);
          }
        );
    }
  }


  private setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = `Cadastro de Categoria`;
    } else {
      const categoryName = this.category.name || '';
      this.pageTitle = `Editando Categoria: ${categoryName}`;
    }
  }

  private createCategory(): void {
    // @ts-ignore
    const category: CategoryModel = Object.assign(new CategoryModel(), this.categoryForm.value);

    this.categoryService.create(category)
      .subscribe(
        categoryNew => this.actionsForSuccess(categoryNew),
        error => this.actionsForError(error)
      );
  }

  private updateCategory(): void {
    // @ts-ignore
    const category: CategoryModel = Object.assign(new CategoryModel(), this.categoryForm.value);

    this.categoryService.update(category)
      .subscribe(
        categoryNew => this.actionsForSuccess(categoryNew),
        error => this.actionsForError(error)
      );
  }

  private actionsForSuccess(category: CategoryModel): void {
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigate([`/categories`]);
  }

  private actionsForError(error: any): void {
    toastr.error(`Ocorreu um erro ao processar a sua solicitação!`);

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
      // Erros do lado do servidor
    } else {
      this.serverErrorMessages = [`Falha na comunicação com o servidor. Por favor, tente mais tarde`];
    }
  }
}
