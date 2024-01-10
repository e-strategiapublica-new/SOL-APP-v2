import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BaseService } from "./base.service";
import { Observable, catchError, firstValueFrom, map } from "rxjs";
import { BidUpdateDateDto } from "src/dtos/bid/bid-update-date.dto";

@Injectable()
export class PlataformService extends BaseService {
  private url = `${environment.api.path}/plataform`;

  constructor(private httpClient: HttpClient) {
    super();
  }

  plataformRegister(dto: BidUpdateDateDto) {
    return this.httpClient.post<BidUpdateDateDto>(`${this.url}/register`, dto, this.authorizedHeader);
  }



  list(): Observable<any> {
    return this.httpClient.get(`${this.url}/list`, this.authorizedHeader).pipe(
      map(response => response),
      catchError(this.serviceError)
    );
  }

  
  updateBid(_id: string, dto: BidUpdateDateDto) {
    return this.httpClient.put(`${this.url}/update/${_id}`, dto, this.authorizedHeader);
  }



}
