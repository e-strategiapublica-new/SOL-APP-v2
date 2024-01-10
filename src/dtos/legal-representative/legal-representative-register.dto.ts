import { MaritalStatusEnum } from "src/enums/marital-status.enum";
import { AddressResponseDto } from "../address/association-response.dto";

export abstract class LegalRepresentativeRegisterDto {
    
    name!: string;
    nationality!: string;
    maritalStatus!: MaritalStatusEnum;
    cpf!: string;
    rg!: string;
    validityData!: Date;
    address!: AddressResponseDto;

}
