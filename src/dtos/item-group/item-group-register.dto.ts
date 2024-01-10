import { ItemsItemGroupRequestDto } from "./item-of-group/item-itemgroup-request.dto";

export abstract class ItemGroupRegisterRequestDto {
    name: string;
    idAgreements: string;
    items: ItemsItemGroupRequestDto[]
}