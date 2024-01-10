import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { CategoryRequestDto } from 'src/dtos/category/category-request.dto';
import { CategoryResponseDto } from 'src/dtos/category/category-response.dto';

@Injectable({
  providedIn: 'root'
})
export class CategoryService  extends BaseService {
 
  private url = `${environment.api.path}/category`;
  category: any[]
  categoryFilter: any[]

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getCategory(): Observable<any> {
    return this.httpClient
      .get(`${this.url}/list`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError)
      );
  }

  getCategoryWithoutAuth(): Observable<any> {
    return this.httpClient
      .get(`${this.url}/listWithAuth`)
      .pipe(map(response => response), catchError(this.serviceError)
      );
  }

  register(dto: CategoryRequestDto): Observable<CategoryResponseDto> {    
    return this.httpClient
      .post(`${this.url}/register`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }
 
  update(Id: string, dto: CategoryRequestDto): Observable<CategoryResponseDto> {
    return this.httpClient
      .put(`${this.url}/update/${Id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  delete(Id: string): Observable<CategoryResponseDto> {
    return this.httpClient
      .delete(`${this.url}/delete-by-id/${Id}`, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  getCategoryList(): any[] {
    return this.category;
  }
  getCategoryFilterList(): any[] {
    return this.categoryFilter;
  }

  setCategoryList(nuevoValor: any[]) {    
    this.category = nuevoValor;
  }

  setCategoryFilterList(nuevoValor: any[]) {    
    this.categoryFilter = nuevoValor;
  }

}