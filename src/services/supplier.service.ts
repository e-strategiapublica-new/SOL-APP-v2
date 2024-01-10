import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { SupplierRegisterDto } from '../dtos/supplier/supplier-register-request.dto';
import { SupplierRegisterBlockRequestDto } from 'src/dtos/supplier/supplier-register-block-request.dt';
import { Observable } from 'rxjs';
import { SupplierRequestDto } from 'src/dtos/supplier/supplier-request.dto';

@Injectable()
export class SupplierService extends BaseService {

    private url = `${environment.api.path}/supplier`;
    fornecedor: any[]
    fornecedorFilter: any[]

    constructor(
        private httpClient: HttpClient
    ) {
        super();
    }

    getById(_id: string) {
        return this.httpClient
            .get(`${this.url}/get-by-id/${_id}`, this.authorizedHeader)
    }

    supplierList(): Observable<SupplierRequestDto[]> {
        return this.httpClient
            .get<SupplierRequestDto[]>(`${this.url}/list`, this.authorizedHeader)
    }

    supplierListWithoutAuth(): Observable<SupplierRequestDto[]> {
        return this.httpClient
            .get<SupplierRequestDto[]>(`${this.url}/listWithoutAuth`)
    }

    register(dto: SupplierRegisterDto) {
        return this.httpClient
            .post(`${this.url}/register`, dto, this.authorizedHeader);
    }

    registerWithoutAuth(dto: SupplierRegisterDto) {
        return this.httpClient
            .post(`${this.url}/registerWithoutAuth`, dto);
    }

    deleteById(_id:string){
        return this.httpClient
        .delete(`${this.url}/delete-by-id/${_id}`, this.authorizedHeader);
    }

    update(_id:string, dto: SupplierRegisterDto){
        return this.httpClient
        .put(`${this.url}/update/${_id}`, dto, this.authorizedHeader);
    }

    block(supplierId: string, dto: SupplierRegisterBlockRequestDto) {
        return this.httpClient
        .put(`${this.url}/block/${supplierId}`, dto, this.authorizedHeader);
    }

    unblock(supplierId: string, dto: SupplierRegisterBlockRequestDto) {
        return this.httpClient
        .put(`${this.url}/unblock/${supplierId}`, dto, this.authorizedHeader);
    }

    getFornecedorList(): any[] {
        return this.fornecedor;
    }
    getFornecedorFilterList(): any[] {
        return this.fornecedorFilter;
    }

    setFornecedorList(nuevoValor: any[]) {    
        this.fornecedor = nuevoValor;
    }

    setFornecedorFilterList(nuevoValor: any[]) {    
        this.fornecedorFilter = nuevoValor;
    }

}
