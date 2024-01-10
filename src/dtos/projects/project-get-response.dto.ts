import { UserInterface } from "src/app/interface/user.interface";
import { AgreementActiveStatusEnum } from "src/enums/agreement-active-status.enum";
import { ConvenioResponseDto } from "../convenio/convenio-response.dto";


export abstract class ProjectGetResponseDto {
    _id: string;
    name: string;
    project_manager: UserInterface;
    agreement_list: ConvenioResponseDto[];
    activeStatus: AgreementActiveStatusEnum;
    createdAt: Date;
    legalRepresentative: any;
    viewer_list?: any[]
    reviewer_list?: any[]
    
}