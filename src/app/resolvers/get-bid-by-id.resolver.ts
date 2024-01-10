import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { AssociationBidService } from "src/services/association-bid.service";

@Injectable({
    providedIn: "root",
})
export class BidGetByIdResolve implements Resolve<any> {

    constructor(
        private associationBidService: AssociationBidService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.associationBidService.getById(route.params['_id']);
    }
}