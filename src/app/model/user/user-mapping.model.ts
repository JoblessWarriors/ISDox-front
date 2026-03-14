import { Department } from "../department/department.model";

export interface UserMapping {
    id?: string;
    email: string;
    firstName: string;
    lastName: string;
    identityType: string;
    identityNumber: string;
    profileImageUrl?: string;
    roles: string[];
    departments?: Department[];
    departmentIds?: string[];
    isActive?: boolean;
    institutionId?: string;
    createdBy?: string;
    createdAt?: Date;
}
