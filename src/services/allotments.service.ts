import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { CategoryRequestDto } from 'src/dtos/category/category-request.dto';
import { CategoryResponseDto } from 'src/dtos/category/category-response.dto';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { AllotmentResponseDto } from 'src/dtos/allotment/allotment-response.dto';

@Injectable({
  providedIn: 'root'
})
export class AllotmentsService extends BaseService {
  private url = `${environment.api.path}/allotment`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getAllotments(): Observable<any> {
    return this.httpClient
      .post(`${this.url}/register`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError))
  }

  getAllotmentsById(Id: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}/allotment-by-id/${Id}`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError)
      );
  }

  download(_id: string) {
    return this.httpClient
      .post(`${this.url}/download-file-by-id/${_id}`, null, this.authorizedHeaderBlob)
      .pipe(map(response => response), catchError(this.serviceError))
  }

}
