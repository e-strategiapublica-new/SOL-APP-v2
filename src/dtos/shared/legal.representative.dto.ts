import { AddressDto } from "./address.dto";
import { MaritalStatusEnum } from "./marital-status.enum";

export class LegalRepresentativeDto{
    name: string;
    nationality: string;
    maritalStatus: MaritalStatusEnum;
    cpf: string;
  /*   rg: string;
    document_origin: string;
    validityData: Date; */
    address: AddressDto;
    phone?: string;
    email?: string;
}