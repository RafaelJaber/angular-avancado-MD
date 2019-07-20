import {AfterContentChecked, OnInit, Injector} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

import { switchMap } from 'rxjs/operators';

import toast from 'toastr';


export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;

  protected route: ActivatedRoute;
  protected router: Router;
  protected fb: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
    protected jsonDataToResourceFn: (jsonData: any) => T
  ) {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.fb = this.injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createResource();
    } else {
      this.updateResource();
    }
  }

  // PRIVATE METHODS

  protected setCurrentAction(): void {
    if (this.route.snapshot.url[0].path === 'new') {
      this.currentAction = 'new';
    } else {
      this.currentAction = 'edit';
    }
  }

  protected loadResource(): void {
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(+params.get('id')))
      )
        .subscribe((resource: T) => {
            this.resource = resource;
            this.resourceForm.patchValue(resource); // binds loader resource data to resourceForm
          },
          (error) => {
            alert(`Ocorreu um erro ao realizar a tarefa: ${error}`);
          }
        );
    }
  }

  protected setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = this.creationPageTitle();
    } else {
      this.pageTitle = this.editionPageTitle();
    }
  }

  protected creationPageTitle(): string {
    return `Novo`;
  }

  protected editionPageTitle(): string {
    return `Edição`;
  }

  protected createResource(): void {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.create(resource)
      .subscribe(
        resourceNew => this.actionsForSuccess(resourceNew),
        error => this.actionsForError(error)
      );
  }

  protected updateResource(): void {
    const resource: T = this.jsonDataToResourceFn(this.resourceForm.value);

    this.resourceService.update(resource)
      .subscribe(
        resourceNew => this.actionsForSuccess(resourceNew),
        error => this.actionsForError(error)
      );
  }

  protected actionsForSuccess(resource: T): void {
    toast.success('Solicitação processada com sucesso!');
    const baseComponentPath: string = this.route.snapshot.parent.url[0].path;
    this.router.navigate([baseComponentPath]);
  }

  protected actionsForError(error: any): void {
    toast.error(`Ocorreu um erro ao processar a sua solicitação!`);

    this.submittingForm = false;

    if (error.status === 422) {
      this.serverErrorMessages = JSON.parse(error._body).errors;
      // Erros do lado do servidor
    } else {
      this.serverErrorMessages = [`Falha na comunicação com o servidor. Por favor, tente mais tarde`];
    }
  }

  protected abstract buildResourceForm(): void;
}
