import { LanguageContractEnum } from "src/enums/language-contract.enum";
import { AssociationBidRequestDto } from "../association/association-bid.dto";

export abstract class ModelContractDto {
    _id: string;
    name!: string;
    classification!: string;
    language: LanguageContractEnum;
    createdAt: Date;
    contract: string;
}
