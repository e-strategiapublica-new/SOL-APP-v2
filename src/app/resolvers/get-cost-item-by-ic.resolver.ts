import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { CostItemsService } from "src/services/cost-items.service";

@Injectable({
    providedIn: "root",
})
export class CostItemGetByIdResolve implements Resolve<any> {

    constructor(
        private costItemsService: CostItemsService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.costItemsService.getById(route.params['_id']);
    }
}