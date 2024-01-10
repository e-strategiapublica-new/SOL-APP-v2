import { AddressRegisterDto } from "../address/association-register.dto";
import { LegalRepresentativeRegisterDto } from "../legal-representative/legal-representative-register.dto";

export abstract class AssociationRegisterRegisterDto {

    _id!: string;
    name!: string;
    cnpj!: string;
    legalRepresentative!: LegalRepresentativeRegisterDto;
    address!: AddressRegisterDto;

}
