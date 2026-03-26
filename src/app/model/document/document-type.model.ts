import { Department } from "../department/department.model";

export interface DocumentType {
    id: string;
    name: string;
    retentionYears: number;
    defaultDepartment: Department;
    requiredAttachmentTypes: string[];
}
