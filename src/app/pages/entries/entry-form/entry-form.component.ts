import { AfterContentChecked, Component, OnInit } from '@angular/core';

import { EntryModel } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: EntryModel = new EntryModel();

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }

  ngAfterContentChecked() {
    this.setPageTitle();
  }

  submitForm(): void {
    this.submittingForm = true;

    if (this.currentAction === 'new') {
      this.createEntry();
    } else {
      this.updateEntry();
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

  private buildEntryForm(): void {
    this.entryForm = this.fb.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
      paid: [null, [Validators.required]],
      categoryId: [null, [Validators.required]]
    });
  }

  private loadEntry(): void {
    if (this.currentAction === 'edit') {

      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
        .subscribe((entry: EntryModel) => {
            this.entry = entry;
            this.entryForm.patchValue(entry); // binds loader entry data to EntryForm
          },
          (error) => {
            alert(`Ocorreu um erro ao realizar a tarefa`);
          }
        );
    }
  }


  private setPageTitle(): void {
    if (this.currentAction === 'new') {
      this.pageTitle = `Cadastro de Lançamento`;
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = `Editando Lançamento: ${entryName}`;
    }
  }

  private createEntry(): void {
    // @ts-ignore
    const entry: EntryModel = Object.assign(new EntryModel(), this.entryForm.value);

    this.entryService.create(entry)
      .subscribe(
        entryNew => this.actionsForSuccess(entryNew),
        error => this.actionsForError(error)
      );
  }

  private updateEntry(): void {
    // @ts-ignore
    const entry: EntryModel = Object.assign(new EntryModel(), this.entryForm.value);

    this.entryService.update(entry)
      .subscribe(
        entryNew => this.actionsForSuccess(entryNew),
        error => this.actionsForError(error)
      );
  }

  private actionsForSuccess(entry: EntryModel): void {
    toastr.success('Solicitação processada com sucesso!');

    this.router.navigate([`/entries`]);
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
