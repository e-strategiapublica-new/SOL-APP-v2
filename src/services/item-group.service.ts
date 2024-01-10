import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { ItemGroupRequestDto } from 'src/dtos/item-group/itemgroup-request.dto';
import { ItemsItemGroupRequestDto } from 'src/dtos/item-group/item-of-group/item-itemgroup-request.dto';
import { ItemsItemGroupResponseDto } from 'src/dtos/item-group/item-of-group/item-itemgroup-response.dto';
import { ItemGroupRegisterResponseDto } from 'src/dtos/item-group/item-group-register-response.dto';
import { ItemGroupResponseDto } from 'src/dtos/item-group/itemgroup-response.dto';

@Injectable({
  providedIn: 'root'
})
export class ItemGroupService extends BaseService {

  private url = `${environment.api.path}/group`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getGroup(): Observable<any> {
    return this.httpClient
      .get(`${this.url}/list`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError)
      );
  }

  register(dto: ItemGroupRequestDto): Observable<ItemGroupRegisterResponseDto> {
    return this.httpClient
      .post(`${this.url}/register`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  getById(id: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}/get-by-id/${id}`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError)
      );
  }


  update(Id: string, dto: ItemGroupRequestDto): Observable<ItemGroupResponseDto> {
    return this.httpClient
      .put(`${this.url}/update/${Id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  updateItem(Id: string, dto: ItemsItemGroupRequestDto): Observable<ItemsItemGroupResponseDto> {
    return this.httpClient
      .put(`${this.url}/update/add-item/${Id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  deleteItem(Id: string, dto: ItemsItemGroupRequestDto): Observable<ItemsItemGroupResponseDto> {
    return this.httpClient
      .put(`${this.url}/update/remove-item/${Id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }


  delete(_id: string) {
    return this.httpClient
      .delete<ItemGroupResponseDto>(`${this.url}/delete-by-id/${_id}`, this.authorizedHeader);
  }
}