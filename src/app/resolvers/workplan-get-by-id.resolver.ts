import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { ConvenioService } from "src/services/convenio.service";
import { WorkPlanService } from "src/services/work-plan.service";

@Injectable({
    providedIn: "root",
})
export class WorkPlanGetByIdResolve implements Resolve<any> {

    constructor(
        private workPlanService: WorkPlanService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.workPlanService.getById(route.params['_id']);
    }
}