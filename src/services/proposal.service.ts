import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';
import { ProposalGetResponseDto } from 'src/dtos/proposals/proposal-get-response.dto';
import { ProposalRefusedRegisterRequestDto } from 'src/dtos/proposals/proposal-refused-register-request.dto';
import { ProposalAcceptReviewerDto } from 'src/dtos/proposals/proposal-accept-reviewer-request.dto';

@Injectable({
    providedIn: 'root'
})
export class ProposalService extends BaseService {

    private url = `${environment.api.path}/proposal`;

    constructor(
        private httpClient: HttpClient
    ) {
        super();
    }

    register(dto: any): Observable<any> {
        return this.httpClient
            .post(`${this.url}/register`, dto, this.authorizedHeader)
            .pipe(map(this.extractData), catchError(this.serviceError));
    }

    listProposal(): Observable<any[]> {
        return this.httpClient
            .get<ProposalGetResponseDto[]>(`${this.url}/list`, this.authorizedHeader);
    }

    listProposalByBid(bidId: any): Observable<any[]> {
        return this.httpClient
            .get<ProposalGetResponseDto[]>(`${this.url}/list-proposal-in-bid/${bidId}`, this.authorizedHeader);
    }

    refusedProposal(proposalId: string, dto: ProposalRefusedRegisterRequestDto): Observable<any> {
            return this.httpClient
            .put(`${this.url}/refuse/${proposalId}`, dto, this.authorizedHeader);
    }

    acceptProposal(proposalId: string): Observable<any> {
        return this.httpClient
            .put(`${this.url}/accept/${proposalId}`, null, this.authorizedHeader)
            .pipe(map(this.extractData), catchError(this.serviceError));
    }

    acceptProposalReviewer(proposalId: string, dto: ProposalAcceptReviewerDto): Observable<any> {
        return this.httpClient
            .put(`${this.url}/update-accept-reviwer/${proposalId}`, dto, this.authorizedHeader)
            .pipe(map(this.extractData), catchError(this.serviceError));
    }

    getProposalAcceptByBid(bidId: string): Observable<any> {
        return this.httpClient
            .get<ProposalGetResponseDto>(`${this.url}/get-proposal-accepted-bid/${bidId}`, this.authorizedHeader);
    }

    getbyId(proposalId: string): Observable<any> {
        return this.httpClient
            .get<ProposalGetResponseDto>(`${this.url}/get-by-id/${proposalId}`, this.authorizedHeader);
    }

    updateValues(_id:string, dto:{freight:number,total_value:string}): Observable<any>{
        return this.httpClient.put(`${this.url}/update-values/${_id}`, dto, this.authorizedHeader)
    }
    
    getProposalVerify(allotmentId: string): Observable<any> {
        return this.httpClient
            .get<boolean>(`${this.url}/verify-proposal-by-user/${allotmentId}`, this.authorizedHeader);
    }

    sendTieBreaker(proposalId: string): Observable<any> {
        return this.httpClient
            .post(`${this.url}/send-tie-breaker/${proposalId}`, null, this.authorizedHeader)
            .pipe(map(this.extractData), catchError(this.serviceError));
    }

}