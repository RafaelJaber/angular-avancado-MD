import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { CategoryModel } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = 'api/categories';

  constructor(
    private http: HttpClient
  ) { }

  getAll(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel>(`${this.apiPath}`).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    );
  }

  getById(id: number): Observable<CategoryModel> {
    const url = `${this.apiPath}/${id}`;

    return this.http.get<CategoryModel>(`${url}`).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategorie)
    );
  }

  create(category: CategoryModel): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(`${this.apiPath}`, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategorie)
    );
  }

  update(category: CategoryModel): Observable<CategoryModel> {
    const url = `${this.apiPath}/${category.id}`;

    return this.http.put<CategoryModel>(`${url}`, category).pipe(
      catchError(this.handleError),
      map(() => category)
    );
  }

  delete(id: number): Observable<any> {
    const url = `${this.apiPath}/${id}`;

    return this.http.delete<any>(`${url}`).pipe(
      catchError(this.handleError),
      map(() => null)
    );
  }


// PRIVATE METHODS

  private jsonDataToCategories(jsonData: any[]): CategoryModel[] {
    const categories: CategoryModel[] = [];
    jsonData.forEach(element => categories.push(element as CategoryModel));
    return categories;
  }

  private jsonDataToCategorie(jsonData: any): CategoryModel {
    return jsonData as CategoryModel;
  }

  private handleError(error: any): Observable<any> {
    console.log(`ERRO NA REQUISIÇÃO => ${error}`);
    return throwError(error);
  }
}
