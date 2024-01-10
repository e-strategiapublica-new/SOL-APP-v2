import { AssociationBidRequestDto } from "../association/association-bid.dto";

export abstract class ModelContractRegisterDto {
    name!: string;
    classification!: AssociationBidRequestDto;
    contract: string;
}
