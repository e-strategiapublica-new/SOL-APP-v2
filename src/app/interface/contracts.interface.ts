import { ContractStatusEnum } from "src/enums/contract-status.enum";
import { LicitationInterface } from "./licitacao.interface";
import { ProposalInterface } from "./proposal.interface";
import { UserInterface } from "./user.interface";

export interface ContractInterface {
  _id: string;
  sequencial_number: number;
  contract_number: string;
  bid_number: any;
  supplier_accept: ContractStatusEnum;
  association_accept: ContractStatusEnum;
  deleted: boolean;
  contract_document: string;
  value: string;
  status: ContractStatusEnum;
  association_sign_date: string;
  supplier_sign_date: string;
  proposal_id: ProposalInterface[];
  supplier_id: any;
  association_id: UserInterface;
  items_received: number;
  createdAt: Date;
}
