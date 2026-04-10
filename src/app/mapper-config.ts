import { DocumentMapping } from "./model/document/document-mapping.model";
import { DocumentRole } from "./model/document/document-role";
import type { Document } from "./model/document/document.model";
import { DossierMapping } from "./model/dossier/dossier-mapping.model";
import { DossierStatus } from "./model/dossier/dossier-status";
import { Dossier } from "./model/dossier/dossier.model";
import { Institution } from "./model/institution/institution.model";
import { Mapper } from "./model/mapper/mapper";
import { IdentityType } from "./model/user/identity-type";
import { UserMapping } from "./model/user/user-mapping.model";
import { UserRole } from "./model/user/user-role";
import { User } from "./model/user/user.model";
import { FraudRiskLevel } from "./model/document/fraud-risk-level";
import { TreeNode } from "primeng/api";

export const initializeMappings = () => {
    Mapper.register<User, UserMapping>('UserToMapping', (u) => ({
        ...u,
        roles: u.roles?.map(role => UserRole[role]) || [],
        departmentIds: u.departments?.map(d => d.id).filter((id): id is string => !!id) || [],
        institutionId: u.institution?.id,
        identityType: IdentityType[u.identityType]
    }));

    Mapper.register<UserMapping, User>('MappingToUser', (m) => ({
        ...m,
        roles: m.roles?.map(roleStr => (UserRole as any)[roleStr]) || [],
        departments: m.departments || [],
        institution: m.institutionId ? { id: m.institutionId } as Institution : undefined,
        identityType: (IdentityType as any)[m.identityType],
    }));

    Mapper.register<Dossier, DossierMapping>('DossierToMapping', (d) => ({
        ...d,
        assignedSpecialist: d.assignedSpecialist != undefined ? Mapper.map('UserToMapping', d.assignedSpecialist) : undefined,
        status: DossierStatus[d.status],
        documents: d.documents?.map(doc => Mapper.map("MappingToDocument", doc)) as DocumentMapping[]
    }));

    Mapper.register<DossierMapping, Dossier>('MappingToDossier', (m) => ({
        ...m,
        assignedSpecialist: m.assignedSpecialist != undefined ? Mapper.map('MappingToUsser', m.assignedSpecialist) : undefined   ,
        status: (DossierStatus as any)[m.status],
        documents: m.documents?.map(doc => Mapper.map("DocumentToMapping", doc)) as Document[]
    }));

    Mapper.register<Document, DocumentMapping>('DocumentToMapping', (d) => ({
        ...d,
        role: DocumentRole[d.role],
        fraudRiskLevel: FraudRiskLevel[d.fraudRiskLevel],
        uploader: d.uploader ? Mapper.map('UserToMapping', d.uploader) : undefined
    }));

    Mapper.register<DocumentMapping, Document>('MappingToDocument', (m) => ({
        ...m,
        role: (DocumentRole as any)[m.role],
        fraudRiskLevel: (FraudRiskLevel as any)[m.fraudRiskLevel],
        uploader: m.uploader ? Mapper.map('MappingToUser', m.uploader) : undefined
    }));

    Mapper.register<DocumentMapping, TreeNode>('DocumentMappingToTreeNode', (m) => ({
        key: m.id,
        label: m.originalFilename || `Document (${m.type})`,
        data: m, 
        icon: 'pi pi-file',
        leaf: true
    }));

    Mapper.register<DossierMapping, TreeNode>('DossierMappingToTreeNode', (m) => ({
        key: m.id,
        label: `${m.documents[0].originalFilename} - ${m.status} - ID: ${m.id}`,
        data: m,
        icon: 'pi pi-folder',
        children: m.documents?.map(doc => Mapper.map('DocumentMappingToTreeNode', doc)) || [],
        expanded: false
    }))
};