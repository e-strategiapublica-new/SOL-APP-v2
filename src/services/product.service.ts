import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { ProductRequestDto } from 'src/dtos/product/product-request.dto';
import { ProductResponseDto } from 'src/dtos/product/product.response.dto';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {

  private url = `${environment.api.path}/product`;
  product: any[]
  productFilter: any[]

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getProduct() {
    return this.httpClient
            .get<ProductResponseDto[]>(`${this.url}/list`, this.authorizedHeader)
  }

  register(dto: ProductRequestDto): Observable<ProductResponseDto> {
    return this.httpClient
      .post(`${this.url}/register`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  updateProduct(Id: string, dto: ProductRequestDto): Observable<ProductResponseDto> {
    return this.httpClient
      .put(`${this.url}/update/${Id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  delete(_id: string) {
    return this.httpClient
      .delete<ProductResponseDto>(`${this.url}/delete-by-id/${_id}`, this.authorizedHeader);
  }

  getProductList(): any[] {
    return this.product;
  }
  getProductFilterList(): any[] {
    return this.productFilter;
  }

  setProductList(nuevoValor: any[]) {    
    this.product = nuevoValor;
  }

  setProductFilterList(nuevoValor: any[]) {    
    this.productFilter = nuevoValor;
  }

}