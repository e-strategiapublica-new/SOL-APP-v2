import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment";
import { BaseService } from "./base.service";
import { AssociationBidRequestDto } from "src/dtos/association/association-bid.dto";
import { BidChangeStatusRequestDto } from "src/dtos/bid/bid-change-status-request.dto";
import { Observable, catchError, firstValueFrom, map } from "rxjs";
import { BidUpdateDateDto } from "src/dtos/bid/bid-update-date.dto";
import { LanguageContractEnum } from "src/enums/language-contract.enum";
import { ModelContractClassificationEnum } from "src/enums/modelContract-classification.enum";

@Injectable()
export class AssociationBidService extends BaseService {
  private url = `${environment.api.path}/bid`;
  licitacoes: any[]
  licitacoesFilter: any[]

  constructor(private httpClient: HttpClient) {
    super();
  }

  bidRegister(dto: AssociationBidRequestDto) {
    return this.httpClient.post<AssociationBidRequestDto>(`${this.url}/register`, dto, this.authorizedHeader);
  }

  bidRegisterFormData(formData: FormData) {
    return this.httpClient.post<AssociationBidRequestDto>(`${this.url}/register`, formData, this.authorizedHeaderMulti);
  }

  list(): Observable<any> {
    return this.httpClient.get(`${this.url}/list`, this.authorizedHeader).pipe(
      map(response => response),
      catchError(this.serviceError)
    );
  }


  listForSupplier(): Observable<any> {
    return this.httpClient.get(`${this.url}/list-for-supplier`, this.authorizedHeader).pipe(
      map(response => response),
      catchError(this.serviceError)
    );
  }

  listForProposalSupplier(): Observable<any> {
    return this.httpClient.get(`${this.url}/list-for-proposal-supplier`, this.authorizedHeader).pipe(
      map(response => response),
      catchError(this.serviceError)
    );
  }

  getByManagerOrReviewerId(_id: string) {
    return this.httpClient.get(`${this.url}/list-bid-by-manager-reviewer/${_id}`, this.authorizedHeader);
  }

  getByReviewerId(_id: string) {
    return this.httpClient.get(`${this.url}/list-bid-by-reviewer/${_id}`, this.authorizedHeader);
  }

  getByManagerId(_id: string) {
    return this.httpClient.get(`${this.url}/list-bid-by-viewer/${_id}`, this.authorizedHeader);
  }
  getByProjectManagerId(_id: string) {
    return this.httpClient.get(`${this.url}/list-bid-by-manager/${_id}`, this.authorizedHeader);
  }

  getById(_id: string) {
    return this.httpClient.get(`${this.url}/get-by-id/${_id}`, this.authorizedHeader);
  }

  changeStatus(bidId: string, dto: BidChangeStatusRequestDto) {
    return this.httpClient.put(`${this.url}/change-status/${bidId}`, dto, this.authorizedHeader);
  }

  updateOpenDate(dto: BidUpdateDateDto) {
    return this.httpClient.put(`${this.url}/update-open-date/`, dto, this.authorizedHeader);
  }

  updateBid(bidId: string, dto: AssociationBidRequestDto) {
    return this.httpClient.put(`${this.url}/update/${bidId}`, dto, this.authorizedHeader);
  }

  deleteBid(Id: string): Observable<AssociationBidRequestDto> {
    return this.httpClient
      .delete(`${this.url}/delete-by-id/${Id}`, this.authorizedHeader)
      .pipe(map(response => response), catchError(this.serviceError));
  }

  download(id: string, type: string): any {
    // return this.httpClient
    //     .get(`${this.url}/download/${id}/${type}`, this.authorizedHeader)

    return this.httpClient.get(`${this.url}/download/${id}/${type}`, {
      headers: this.authorizedHeaderFile.headers,
      responseType: "blob",
    }).pipe(map(response => response), catchError(this.serviceError))
  }


  bidPdf(_id: string, type: string) {
    return firstValueFrom(this.httpClient
      .get(`${this.url}/bid-pdf/${_id}/${type}`, this.authorizedHeader)
      .pipe(map((response: any) => response))
    );
  }

  listByAssociation() {
    return this.httpClient.get(`${this.url}/list-by-association`, this.authorizedHeader);
  }

  downloadDocument(_id:string, lang: LanguageContractEnum, type:ModelContractClassificationEnum){
    return firstValueFrom(
      this.httpClient
        .get(`${this.url}/create-document/${_id}/${lang}/${type}`, {
          headers: this.authorizedHeaderFile.headers,
          responseType: "blob",
        })
        .pipe(map((response: any) => response))
    );
  }

  report(){
    return this.httpClient.get(`${this.url}/report`, this.authorizedHeader);
  }

  getLicitacoesList(): any[] {
    return this.licitacoes;
  }
  getLicitacoesFilterList(): any[] {
    return this.licitacoesFilter;
  }

  setLicitacoesList(nuevoValor: any[]) {    
    this.licitacoes = nuevoValor;
  }

  setLicitacoesFilterList(nuevoValor: any[]) {    
    this.licitacoesFilter = nuevoValor;
  }

}
