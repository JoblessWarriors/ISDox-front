import { Department } from "../department/department.model";
import { Institution } from "../institution/institution.model";
import { IdentityType } from "./identity-type";
import { UserRole } from "./user-role";

export interface User {
    id?: string;
    institution?: Institution,
    email: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
    identityType: IdentityType;
    identityNumber: string;
    roles: UserRole[];
    departments: Department[];
    isActive?: boolean;
    createdBy?: string;
    createdAt?: Date;
}
