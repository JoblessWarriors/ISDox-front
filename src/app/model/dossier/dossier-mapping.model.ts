import { Department } from "../department/department.model";
import { DocumentMapping } from "../document/document-mapping.model";
import { UserMapping } from "../user/user-mapping.model";

export interface DossierMapping {
    id: string;
    status: string;
    department?: Department;
    assignedSpecialist?: UserMapping;
    documents: DocumentMapping[];
    createdBy: string;
    createdAt: Date;
}
