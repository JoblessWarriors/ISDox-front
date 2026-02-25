import { Department } from "../department/department.model";
import { IdentityType } from "./identity-type";
import { UserRole } from "./user-role";

export interface User {
    id: string;
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    identityType: IdentityType;
    identityNumber: string;
    roles: Set<UserRole>;
    departments: Set<Department>;
    isActive: boolean;
    anonymizetAt: Date;
    createdAt: Date;
}
