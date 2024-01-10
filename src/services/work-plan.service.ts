import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Observable, catchError, map } from "rxjs";
import { WorkPlanInterface } from "src/dtos/convenio/convenio-response.dto";
import { WorkPlanRegisterRequest } from "src/dtos/workPlan/work-plan-register-request.dto";

@Injectable({
  providedIn: 'root'
})
export class WorkPlanService extends BaseService {

  private url = `${environment.api.path}/workplan`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  list():Observable<WorkPlanInterface[]> {
    return this.httpClient
      .get(`${this.url}`, this.authorizedHeader)
      .pipe(map<any,any>(response => response), catchError(this.serviceError));
  }

  getById(id: string): Observable<WorkPlanInterface> {
    return this.httpClient
      .get(`${this.url}/${id}`, this.authorizedHeader)
      .pipe(map<any,any>(response => response), catchError(this.serviceError));
  }

  create(workPlan: WorkPlanRegisterRequest): Observable<WorkPlanInterface> {
    return this.httpClient
      .post(`${this.url}/register`, workPlan, this.authorizedHeader)
      .pipe(map<any,any>(response => response), catchError(this.serviceError));
  }

  delete(id: string): Observable<WorkPlanInterface> {
    return this.httpClient
      .delete(`${this.url}/${id}`, this.authorizedHeader)
      .pipe(map<any,any>(response => response), catchError(this.serviceError));
  }

  update(id: string, workPlan: WorkPlanRegisterRequest): Observable<WorkPlanInterface> {
    return this.httpClient
      .put(`${this.url}/update/${id}`, workPlan, this.authorizedHeader)
      .pipe(map<any,any>(response => response), catchError(this.serviceError));
  }
}