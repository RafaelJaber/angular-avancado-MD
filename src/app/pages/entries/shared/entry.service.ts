import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import {catchError, flatMap} from 'rxjs/operators';

import { EntryModel } from './entry.model';
import {CategoryService} from '../../categories/shared/category.service';

import { BaseResourceService } from '../../../shared/services/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<EntryModel> {

  constructor(
    protected injector: Injector,
    private categoryService: CategoryService
  ) {
    super('api/entries', injector, EntryModel.fromJson);
  }

  create(entry: EntryModel): Observable<EntryModel> {
    return this.setCategoryAndSendToServer(entry, super.create.bind(this));
  }

  update(entry: EntryModel): Observable<EntryModel> {
    return this.setCategoryAndSendToServer(entry, super.update.bind(this));
  }

// PRIVATE METHODS

  private setCategoryAndSendToServer(entry: EntryModel,
                                     sendFn: (entry: EntryModel) => Observable<EntryModel>): Observable<EntryModel> {
    return this.categoryService.getById(entry.categoryId).pipe(
      flatMap(category => {
        entry.category = category;
        return sendFn(entry);
      }),
      catchError(this.handleError)
    );
  }
}
