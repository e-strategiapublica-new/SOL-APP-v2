import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { ClassesRequestDto } from 'src/dtos/classes/classes-request.dto';
import { ClassesResponseDto } from 'src/dtos/classes/classes-response.dto';

@Injectable({
  providedIn: 'root'
})
export class ClassesService extends BaseService {
 
  private url = `${environment.api.path}/classes`;
  
  classes: any[];
  classesFilter: any[];

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }
  
  getClasses(): Observable<any> {
    return this.httpClient
      .get(`${this.url}/list`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError)
    );
  }

  register(dto: ClassesRequestDto): Observable<ClassesResponseDto> {    
    return this.httpClient
      .post(`${this.url}/register`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  update(id: string, dto: any): Observable<ClassesResponseDto> {   
    return this.httpClient
      .put(`${this.url}/update/${id}`, dto, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  delete(Id: string): Observable<ClassesResponseDto> {
    return this.httpClient
      .delete(`${this.url}/delete-by-id/${Id}`, this.authorizedHeader)
      .pipe(map(this.extractData), catchError(this.serviceError));
  }

  getClassesList(): any[] {
    return this.classes;
  }
  getClassesFilterList(): any[] {
    return this.classesFilter;
  }

  setClassesList(nuevoValor: any[]) {    
    this.classes = nuevoValor;
  }

  setClassesFilterList(nuevoValor: any[]) {    
    this.classesFilter = nuevoValor;
  }

}