import { User } from "../user/user.model";
import { MetaDataItem } from "./document-mapping.model";
import { DocumentRole } from "./document-role";
import { DocumentType } from "./document-type.model";
import { FraudRiskLevel } from "./fraud-risk-level";

export interface Document {
    id: string;
    role: DocumentRole;
    type: DocumentType;
    originalFilename: string;
    storagePath: string;
    extractedText: string;
    isIndexedForSearch: boolean;
    metadata: MetaDataItem[];
    pageCount: number;
    fraudRiskLevel: FraudRiskLevel;
    fraudReport: string;
    uploader?: User;
}
