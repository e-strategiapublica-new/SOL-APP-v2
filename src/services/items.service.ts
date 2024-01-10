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
export class ItemsService extends BaseService {
 
  private url = `${environment.api.path}/items`;
  item: any[]
  itemFilter: any[]

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getItems(): Observable<any> {
    return this.httpClient
      .get(`${this.url}/list`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError)
      );
  } 

  getById(_id: string) {
    return this.httpClient
      .get<any>(`${this.url}/get-by-id/${_id}`, this.authorizedHeader);
  }

  register(dto: any): Observable<any> {    
    return this.httpClient
      .post(`${this.url}/register`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }
 
 
  update(Id: string, dto: any): Observable<any> {
    return this.httpClient
      .put(`${this.url}/update/${Id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }  
  

  delete(Id: string): Observable<any> {
    return this.httpClient
      .delete(`${this.url}/delete-by-id/${Id}`, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  getItemList(): any[] {
    return this.item;
  }
  getItemFilterList(): any[] {
    return this.itemFilter;
  }

  setItemList(nuevoValor: any[]) {    
    this.item = nuevoValor;
  }

  setItemFilterList(nuevoValor: any[]) {    
    this.itemFilter = nuevoValor;
  }

}