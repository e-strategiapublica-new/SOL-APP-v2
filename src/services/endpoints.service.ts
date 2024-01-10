import { Injectable } from "@angular/core";
import { BaseService } from "./base.service";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { EndPointsRegisterRequestDto } from "src/dtos/endpoints/endpoints-register-request.dto";
import { EndPointsTypeEnum } from "src/enums/endpoints-type.enum";


@Injectable({
  providedIn: 'root'
})
export class EndPointsService extends BaseService {

  private url = `${environment.api.path}/endpoints`;

  constructor(
    private httpClient: HttpClient
  ) {
    super();
  }

  list() {
    return this.httpClient
      .get<any[]>(`${this.url}/list`, this.authorizedHeader);
  }

  getById(_id: string) {
    return this.httpClient
      .get<any>(`${this.url}/get-by-id/${_id}`, this.authorizedHeader);
  }

  register(dto: EndPointsRegisterRequestDto) {
    return this.httpClient
      .post(`${this.url}/register`, dto, this.authorizedHeader);
  }

  update(_id: string, dto: EndPointsRegisterRequestDto) {
    return this.httpClient
      .put(`${this.url}/update/${_id}`, dto, this.authorizedHeader);
  }

  delete(_id: string) {
    return this.httpClient
      .delete(`${this.url}/delete/${_id}`, this.authorizedHeader);
  }

  forceJob(type:EndPointsTypeEnum){
    return this.httpClient
      .get(`${this.url}/force-job/${type}`, this.authorizedHeader);
  }

}