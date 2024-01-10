import { UserListResponseDto } from "../user/user-list-response.dto";

export abstract class TemplateContractResponseDto {
    name?: string;
    content?: string;
    creator?: UserListResponseDto;
}