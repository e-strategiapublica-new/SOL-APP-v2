import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { ProposalService } from "src/services/proposal.service";

@Injectable({
    providedIn: "root",
})
export class GetProposalByIdResolve implements Resolve<any> {

    constructor(
        private proposalService: ProposalService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.proposalService.getbyId(route.params['_id']);
    }
}