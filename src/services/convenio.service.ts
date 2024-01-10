import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { ConvenioResponseDto } from 'src/dtos/convenio/convenio-response.dto';
import { ConvenioRequestDto } from 'src/dtos/convenio/convenio-request.dto';
import { UserTypeRequestDto } from 'src/dtos/user/user-type-request.dto';

@Injectable({
  providedIn: 'root'
})
export class ConvenioService extends BaseService {

  private url = `${environment.api.path}/convenios`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }
  getConvenio(): Observable<any[]> {
    return this.httpClient
      .get(`${this.url}`, this.authorizedHeader)
      .pipe(map<any, any>(response => response), catchError(this.serviceError));
  }

  getConvenioForAssociation(): Observable<any[]> {
    return this.httpClient
      .get<any[]>(`${this.url}/for-association`, this.authorizedHeader);
  }

  getConvenioWithProjects(): Observable<any[]> {
    return this.httpClient
      .get<any[]>(`${this.url}/agreement-with-project`, this.authorizedHeader);
  }

  getConvenioById(convenioId: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}/${convenioId}`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError));
  }

  getConvenioByUserId(userId: string, dto:UserTypeRequestDto): Observable<any> {
   
    return this.httpClient
      .post(`${this.url}/by-user-id/${userId}`, dto, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError));
  }

  getConvenioWithoutProject(): Observable<any> {
    return this.httpClient.get(`${this.url}/without-project`, this.authorizedHeader)
      .pipe(catchError(this.serviceError));
  }

  register(dto: ConvenioRequestDto): Observable<ConvenioResponseDto> {
    return this.httpClient
      .post(`${this.url}/register`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  updateConvenio(Id: string, dto: ConvenioRequestDto): Observable<ConvenioResponseDto> {
    return this.httpClient
      .put(`${this.url}/update/${Id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  deleteConvenio(Id: string): Observable<ConvenioRequestDto> {
    return this.httpClient
      .delete(`${this.url}/${Id}`, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  addWorkPlan(Id: string, dto: { workPlanId: string }): Observable<ConvenioResponseDto> {
    return this.httpClient
      .put(`${this.url}/add-work-plan/${Id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  removeWorkPlan(Id: string, dto: { workPlanId: string }): Observable<ConvenioResponseDto> {
    return this.httpClient
      .put(`${this.url}/remove-work-plan/${Id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

}
