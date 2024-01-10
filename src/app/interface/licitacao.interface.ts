export interface LicitationInterface {
    _id: number;
    numero: string;
    association: string;
    modalidade: string;
    status: string;
    revisor: string;
    datastart: string;
    dataend: string;
    description: string;
    class: string;
    local: string;
    prazo: string;
    dias: string;
    convenio: string;
    supplier: string;
    value: string;
    tipo: string;
    lote: string;
    Item: string;
    quantity: string;
    site: string;
    proposal: string;
}
export interface AllotmentRequestDto {
    allotment_name: string;
    days_to_delivery: string;
    place_to_delivery: string;
    quantity: string;
    add_item: ItemRequestDto[];
    files: string;
    isSectionOpen? : Boolean;
}
export interface ItemRequestDto {
    group: string;
    item: string;
    quantity: string;
    unitMeasure: any;
    specification: string;
}