import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { AssociationResponseDto } from 'src/dtos/association/association-response.dto';
import { AssociationRegisterRegisterDto } from 'src/dtos/association/association-register.dto';
import { Observable, catchError, map } from 'rxjs';

@Injectable()
export class AssociationService extends BaseService {

  deleteAssociation: AssociationResponseDto | null = null;
  deleted: boolean = false;

  private url = `${environment.api.path}/association`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  list() {
    return this.httpClient
      .get<AssociationResponseDto[]>(`${this.url}/list`, this.authorizedHeader);
  }

  register(dto: AssociationRegisterRegisterDto) {
    return this.httpClient
      .post<AssociationResponseDto>(`${this.url}/register`, dto, this.authorizedHeader);
  }

  update(_id: string, dto: AssociationRegisterRegisterDto) {
    return this.httpClient
      .put<AssociationResponseDto>(`${this.url}/update/${_id}`, dto, this.authorizedHeader);
  }

  delete(_id: string) {
    return this.httpClient
      .delete<AssociationResponseDto>(`${this.url}/delete-by-id/${_id}`, this.authorizedHeader);
  }

  getById(_id: string) {
    return this.httpClient
      .get<AssociationResponseDto>(`${this.url}/get-by-id/${_id}`, this.authorizedHeader);
  }

  listAllAssociation() {
    return this.httpClient
      .get(`${environment.api.path}/associacao`, this.authorizedHeader);
  }

  AssociationTransaction() {
    return this.httpClient
      .post(`${environment.api.path}/associacao`, this.authorizedHeader);
  }

}
