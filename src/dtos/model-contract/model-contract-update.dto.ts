import { AssociationBidRequestDto } from "../association/association-bid.dto";

export abstract class ModelContractUpdateDto {
    _id: string;
    name!: string;
    bid!: AssociationBidRequestDto;
    contract: string;
}
