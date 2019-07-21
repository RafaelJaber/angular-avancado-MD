import { Injectable, Injector } from '@angular/core';

import { Observable } from 'rxjs';
import {catchError, flatMap, map} from 'rxjs/operators';

import { EntryModel } from './entry.model';
import {CategoryService} from '../../categories/shared/category.service';

import { BaseResourceService } from '../../../shared/services/base-resource.service';

import * as moment from 'moment';

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

  getByMonthAndYear(month: string, year: string): Observable<EntryModel[]> {
    return this.getAll().pipe(
      map(entries => this.filterByMonthAndYear(entries, month, year))
    );
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

  private filterByMonthAndYear(entries: EntryModel[], month: string, year: string) {
    return entries.filter(
      entry => {
        const entryDate = moment(entry.date, 'DD/MM/YYYY');
        const monthMatches = String(entryDate.month() + 1) === month;
        const yearMatches = String(entryDate.year()) === year;

        if ( monthMatches && yearMatches ) {
          return entry;
        }
      }
    );
  }
}
