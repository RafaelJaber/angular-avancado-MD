import { OnInit, Injector } from '@angular/core';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';


export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(
    protected resourceService: BaseResourceService<T>,
  ) { }

  ngOnInit() {
    this.resourceService.getAll()
      .subscribe(
        resource => this.resources = resource.sort((a, b) => b.id - a.id),
        error => alert(`Erro ao carregar a lista`));
  }

  deleteResource(resource: T, deleteMessage?: string) {
    let mustDelete: boolean;
    if (deleteMessage) {
      mustDelete = confirm(deleteMessage);
    } else {
      mustDelete = confirm(`Deseja realmente excluir o item?`);
    }

    if (mustDelete) {
      this.resourceService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element !== resource),
        () => alert(`Erro ao tentar excluir!`)
      );
    }
  }
}
