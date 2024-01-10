import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class NominatimService {

    constructor(
        private _httpClient: HttpClient,
    ) { }

    getLatLongByAddress(street: string, city: string, country: string, state: string) {
        return firstValueFrom(
            this._httpClient.get(
                `https://nominatim.openstreetmap.org/search?format=json&street=${street}&city=${city}&country=${country}&state=${state}`
            ).pipe((response) => response)
        );
    }

    getLatLongByAddressByCep(cep: string) {
        return firstValueFrom(
            this._httpClient.get(
                `https://nominatim.openstreetmap.org/search?format=json&postalcode=${cep}`
            ).pipe((response) => response)
        );
    }
}