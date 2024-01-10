import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { AssociationBidRequestDto } from 'src/dtos/association/association-bid.dto';
import { Observable, catchError, map } from 'rxjs';
import { ModelContractRegisterDto } from 'src/dtos/model-contract/model-contract-register.dto';
import { ModelContractUpdateDto } from 'src/dtos/model-contract/model-contract-update.dto';
import { ModelContractDto } from 'src/dtos/model-contract/model-contract.copy';

@Injectable()
export class ModelContractService extends BaseService {

    private url = `${environment.api.path}/model-contract`;
    template: any[]
    templateFilter: any[]

    constructor(
        private httpClient: HttpClient
    ) {
        super();
    }

    modelContractRegister(dto: any) {
        return this.httpClient
            .post<ModelContractRegisterDto>(`${this.url}/register`, dto, this.authorizedHeaderMulti);
    }

    list(): Observable<any> {
        return this.httpClient
            .get(`${this.url}/list`, this.authorizedHeader)
            .pipe(map(response => response), catchError(this.serviceError)
            );
    }

    getById(_id: string) {
        return this.httpClient
          .get<ModelContractDto>(`${this.url}/get-by-id/${_id}`, this.authorizedHeader);
      }

    updateModelContract(_Id: string, dto: any) {
        return this.httpClient
            .put(`${this.url}/update/${_Id}`, dto, this.authorizedHeaderMulti);
    }

    delete(_id: string) {
       return this.httpClient
      .delete(`${this.url}/delete-by-id/${_id}`, this.authorizedHeader);
    }

    getTemplateList(): any[] {
        return this.template;
    }
    getTemplateFilterList(): any[] {
        return this.templateFilter;
    }

    setTemplateList(nuevoValor: any[]) {    
        this.template = nuevoValor;
    }

    setTemplateFilterList(nuevoValor: any[]) {    
        this.templateFilter = nuevoValor;
    }

}