import { ProposalStatusEnum } from "src/enums/proposal-status.enum";
import { LicitationInterface } from "./licitacao.interface";
import { UserInterface } from "./user.interface";
import { AllotmentInterface } from "./allotment.interface";


export interface ProposalInterface {
    _id: string;
    total_value: string;
    status: ProposalStatusEnum;
    deleted: boolean;
    item_list: string[];
    bid: LicitationInterface;
    allotment: AllotmentInterface[];
    file: string;

    association_accept: boolean;
    supplier_accept: boolean;
    proposalWin: boolean;
    refusedBecaused: string;
    refusedBy: UserInterface;
    proposedBy: UserInterface;
    acceptedRevisor: UserInterface;
    acceptedFornecedor: UserInterface;
    acceptedFornecedorAt: Date;
    acceptedRevisorAt: Date;
    refusedAt: Date;
    freight: number;

    totalValueForAllotment?: ValueForAllotmentInterface[];
}


export interface ProposalInAllotmentInterface {
    proposal: ProposalInterface;
    proposalWin: boolean;
}

export interface ValueForAllotmentInterface {
    readonly allotmentId: string;
    readonly totalValue: number
}