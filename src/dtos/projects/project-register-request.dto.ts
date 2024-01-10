import { LegalRepresentativeDto } from "../shared/legal.representative.dto";
import { UserRegisterRequestDto } from "../user/user-register-request.dto";

export abstract class ProjectRegisterRequestDto {
    name: string;
    project_manager: string;
    agreement: string;
    agreement_list: string[];
    legalRepresentative: LegalRepresentativeDto;
    viewer_list: UserRegisterRequestDto[];
    reviewer_list: UserRegisterRequestDto[]

}