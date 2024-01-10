export abstract class AllotmentResquestDto {
    allotment_name: string;
    days_to_delivery: string;
    place_to_delivery: string;
    quantity: string;
    files: string;
    proposals: Proposal[];
    add_item: Additem[];
}

class Proposal {
    total_value: string;
    deleted: boolean;
    status: string;
    item_list: string[]
}

class Additem {
    group: string;
    item: string;
    quantity: string;
}