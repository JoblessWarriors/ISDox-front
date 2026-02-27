import { Department } from "../department/department.model";
import { IdentityType } from "./identity-type";
import { UserRole } from "./user-role";

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    identityType: IdentityType;
    identityNumber: string;
    roles: UserRole[];
    departments: Department[];
    isActive: boolean;
    anonymizedAt: Date;
    createdAt: Date;
}
