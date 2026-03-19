import { Department } from "../department/department.model";
import { UserMapping } from "../user/user-mapping.model";

export interface DossierMapping {
    id: string;
    status: string;
    department?: Department;
    assignedSpecialist?: UserMapping;
    documents: any[];
    createdBy: string;
    createdAt: Date;
}
