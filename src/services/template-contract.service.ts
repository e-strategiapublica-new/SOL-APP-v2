import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs';
import { TemplateContractRequestDto } from 'src/dtos/template-contract/template-contract-request.dto';
import { UpdateTemplateContractRequestDto } from 'src/dtos/template-contract/update-template-contract-request.dto';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class TemplateContractService extends BaseService {

  private url = `${environment.api.path}/template-contract`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }
  listTemplates() {
    return this.httpClient
      .get(`${this.url}/list/`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError));
  }

  getTemplateById(_id: string) {
    return this.httpClient
      .get(`${this.url}/get-by-id/${_id}`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError));
  }

  registerTemplate(dto: TemplateContractRequestDto) {
    return this.httpClient
      .post(`${this.url}/register`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  updateTemplate(_id: string, dto: UpdateTemplateContractRequestDto) {
    return this.httpClient
      .put(`${this.url}/update/${_id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  deleteTemplate(_id: string) {
    return this.httpClient
      .delete(`${this.url}/delete-by-id/${_id}`, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

}
