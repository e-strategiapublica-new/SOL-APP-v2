import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { environment } from 'src/environments/environment';
import { Observable, catchError } from 'rxjs';
import { ProjectGetResponseDto } from 'src/dtos/projects/project-get-response.dto';
import { ProjectRegisterRequestDto } from 'src/dtos/projects/project-register-request.dto';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService extends BaseService {

  private url = `${environment.api.path}/projetos`;
  projects: any[]
  projectsFilter: any[]

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  getProjects(): Observable<ProjectGetResponseDto[]> {
    return this.httpClient.get<ProjectGetResponseDto[]>(this.url, this.authorizedHeader)
      .pipe(catchError(this.serviceError));
  }

  getProjectById(_id: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}/${_id}`, this.authorizedHeader)
      .pipe(catchError(this.serviceError));
  }
  findAllProjectsForAssociationId(id: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}/find-projects-for-associationId/${id}`, this.authorizedHeader)
      .pipe(catchError(this.serviceError));
  }

  findAllProjectsForViewerId(id: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}/find-projects-for-viewer/${id}`, this.authorizedHeader)
      .pipe(catchError(this.serviceError));
  }

  findAllProjectsForManagerId(id: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}/find-projects-for-manager/${id}`, this.authorizedHeader)
      .pipe(catchError(this.serviceError));
  }

  findAllProjectsForReviewerId(id: string): Observable<any> {
    return this.httpClient
      .get(`${this.url}/find-projects-for-reviewer/${id}`, this.authorizedHeader)
      .pipe(catchError(this.serviceError));
  }

  registerProject(dto: ProjectRegisterRequestDto) {
    return this.httpClient.post(`${this.url}/register`, dto, this.authorizedHeader)
    .pipe(catchError(this.serviceError));
  }

  deleteProjectById(_id: string): Observable<any> {
    return this.httpClient.delete(`${this.url}/${_id}`, this.authorizedHeader)
      .pipe(catchError(this.serviceError));
  }

  getProjectsList(): any[] {
    return this.projects;
  }
  getProjectsFilterList(): any[] {
    return this.projectsFilter;
  }

  setProjectsList(nuevoValor: any[]) {    
    this.projects = nuevoValor;
  }

  setProjectsFilterList(nuevoValor: any[]) {    
    this.projectsFilter = nuevoValor;
  }

}
