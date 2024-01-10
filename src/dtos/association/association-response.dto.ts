import { AddressResponseDto } from "../address/association-response.dto";
import { LegalRepresentativeResponseDto } from "../legal-representative/legal-representative-response.dto";

export abstract class AssociationResponseDto {

    _id!: string;
    name!: string;
    cnpj!: string;
    legalRepresentative!: LegalRepresentativeResponseDto;
    address!: AddressResponseDto;

}
