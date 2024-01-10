import { UserRolesEnum } from "src/enums/user-roles.enum";
import { UserStatusEnum } from "src/enums/user-status.enum";
import { UserTypeEnum } from "src/enums/user-type.enum";


export interface UserInterface {
    _id: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    document?: string;
    status: UserStatusEnum;
    type: UserTypeEnum;
    createdAt: Date;
    profilePicture?: string;
    office?: string;
    association?: any;
    supplier?: any;
    roles?: UserRolesEnum;
    notification_list?: any[]

}