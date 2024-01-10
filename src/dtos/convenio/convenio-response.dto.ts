import { AgreementStatusEnum } from "src/enums/agreement-status.enum";
import { AssociationResponseDto } from "../association/association-response.dto";
import { UserListResponseDto } from "../user/user-list-response.dto";
import { CostItemsResponseDto } from "../cost-items/cost-items-response.dto";
import { AgreementActiveStatusEnum } from "src/enums/agreement-active-status.enum";
import { ProjectGetResponseDto } from "../projects/project-get-response.dto";

export abstract class ConvenioResponseDto {
  _id: string;
  register_number: string;
  register_object: string;
  status: AgreementStatusEnum;
  activeStatus: AgreementActiveStatusEnum;
  city: string;
  states: string;
  value: number;
  validity_date: Date;
  signature_date: Date;
  association: AssociationResponseDto;
  reviewer: any;
  manager: UserListResponseDto;
  project?: any;
  workPlan: WorkPlanInterface[];
}

export interface WorkPlanInterface {
  _id: string;
  name: string;
  product: Array<{ quantity: number; unit: string; unitValue: number; costItems: CostItemsResponseDto; _id: string }>;
}

export interface WorkPlanDto {
  _id: string;
  name: string;
  product: Array<{ quantity: number; unit: string; unitValue: number; costItems: string; _id: string }>;
}
