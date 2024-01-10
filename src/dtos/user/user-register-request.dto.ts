import { UserRolesEnum } from "src/enums/user-roles.enum";
import { UserTypeEnum } from "src/enums/user-type.enum";

export abstract class UserRegisterRequestDto {

    email!: string;
    name!: string;
    phone?: string;
    type!: UserTypeEnum;
    cpf?: string;
    // office?: string;
    association?: string;
    supplier?: string;
    roles?: UserRolesEnum;
    
}