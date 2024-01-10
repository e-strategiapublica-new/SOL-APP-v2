import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { ConvenioService } from "src/services/convenio.service";

@Injectable({
    providedIn: "root",
})
export class AgreementGetByIdResolve implements Resolve<any> {

    constructor(
        private conveniosService: ConvenioService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        return this.conveniosService.getConvenioById(route.params['_id']);
    }
}