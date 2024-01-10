export class GetLatLongByCepResponseDto {
    formattedAddress: string
    latitude: number
    longitude: number
    extra: Extra
    administrativeLevels: AdministrativeLevels
    streetName: string
    country: string
    countryCode: string
    zipcode: string
    provider: string
}

export interface Extra {
    googlePlaceId: string
    confidence: number
    premise: any
    subpremise: any
    neighborhood: string
    establishment: any
}

export interface AdministrativeLevels {
    level2long: string
    level2short: string
    level1long: string
    level1short: string
}