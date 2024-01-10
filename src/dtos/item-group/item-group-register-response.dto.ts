import { ItemsItemGroupResponseDto } from "./item-of-group/item-itemgroup-response.dto";

export abstract class ItemGroupRegisterResponseDto {
    _id?: string;
    name?: string;
    idAgreements?: string;
    items?: ItemsItemGroupResponseDto[]
}