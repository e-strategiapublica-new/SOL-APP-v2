import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { CostItemsResponseDto } from 'src/dtos/cost-items/cost-items-response.dto';
import { CostItemsRegisterDto } from 'src/dtos/cost-items/cost-items-register.dto';
import { Observable, map, catchError } from 'rxjs';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';

@Injectable()
export class CostItemsService extends BaseService {

  deleteItems: CostItemsResponseDto | null = null;
  deleted = false;

  private url = `${environment.api.path}/cost-items`;
  costItem: any[]
  costItemFilter: any[]

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  list() {
    return this.httpClient
      .get<CostItemsResponseDto[]>(`${this.url}/list`, this.authorizedHeader);
  }

  getByManagerId(_id: string) {
    return this.httpClient
      .get<CostItemsResponseDto[]>(`${this.url}/get-by-project-manager-id/${_id}`, this.authorizedHeader);
  }

  getById(_id: string) {
    return this.httpClient
      .get<CostItemsResponseDto>(`${this.url}/get-by-id/${_id}`, this.authorizedHeader);
  }

  register(dto: CostItemsRegisterDto): Observable<ConvenioResponseDto> {
    return this.httpClient
      .post(`${this.url}/register`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  update(_id: string, dto: CostItemsRegisterDto): Observable<ConvenioResponseDto> {
    return this.httpClient
      .put(`${this.url}/update-by-id/${_id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  delete(_id: string) {
    return this.httpClient
      .delete<CostItemsResponseDto>(`${this.url}/delete-by-id/${_id}`, this.authorizedHeader);
  }

  getCostItemList(): any[] {
    return this.costItem;
  }
  getCostItemFilterList(): any[] {
    return this.costItemFilter;
  }

  setCostItemList(nuevoValor: any[]) {    
    this.costItem = nuevoValor;
  }

  setCostItemFilterList(nuevoValor: any[]) {    
    this.costItemFilter = nuevoValor;
  }


}
