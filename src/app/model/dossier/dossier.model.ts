import { Department } from "../department/department.model";
import { Document } from "../document/document.model";
import { RegistryEntry } from "../registry-entry/registry-entry.model";
import { User } from "../user/user.model";
import { DossierStatus } from "./dossier-status";

export interface Dossier {
    id: string;
    status: DossierStatus;
    department?: Department;
    assignedSpecialist?: User;
    registryEntry?: RegistryEntry;
    documents: Document[];
    createdBy: string;
    createdAt: Date;
}
