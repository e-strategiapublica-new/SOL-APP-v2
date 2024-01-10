import { UserStatusEnum } from "src/enums/user-status.enum";
import { UserTypeEnum } from "src/enums/user-type.enum";
import { AssociationResponseDto } from "../association/association-response.dto";
import { UserRolesEnum } from "src/enums/user-roles.enum";

export abstract class UserTypeRequestDto {
    roles?: UserRolesEnum;
 
}