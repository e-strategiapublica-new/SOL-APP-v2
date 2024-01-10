import { AllotmentStatusEnum } from "src/enums/allotment-status.enum";
import { ProposalInAllotmentInterface } from "./proposal.interface";

export interface AllotmentInterface {
    _id: string;
    allotment_name: string;
    days_to_delivery: string;

    place_to_delivery: string;

    status: AllotmentStatusEnum;

    quantity: string;
    files: string;
    add_item: any[];
    proposals: ProposalInAllotmentInterface[];


}