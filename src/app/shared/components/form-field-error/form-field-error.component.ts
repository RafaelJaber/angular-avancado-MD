import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-field-error',
  templateUrl: './form-field-error.component.html',
  styleUrls: ['./form-field-error.component.css']
})
export class FormFieldErrorComponent implements OnInit {

  @Input('form-control') formControl: FormControl;

  constructor() { }

  ngOnInit() {
  }

  public get errorMessage(): string | null {
    if ( this.mustShowErrorMessage() ) {
      return this.getErrorMessage();
    } else {
      return null;
    }
  }

  private mustShowErrorMessage(): boolean {
    return this.formControl.invalid && this.formControl.touched;
  }

  private getErrorMessage(): string | null {
    if ( this.formControl.errors.required ) {
      return 'Campo obrigatório';
    } else if ( this.formControl.errors.minlength ) {
      const requiredLength = this.formControl.errors.minlength.requiredLength;
      return `Deve possuir no mínimo ${requiredLength} caracteres`;
    } else if ( this.formControl.errors.maxlength ) {
      const requiredLength = this.formControl.errors.maxlength.requiredLength;
      return `Deve possuir no máximo ${requiredLength} caracteres`;
    } else if (this.formControl.errors.email) {
      return 'Formato de e-mail inválido';
    }
  }

}
