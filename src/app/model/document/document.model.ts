import { User } from "../user/user.model";
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
    metadata: Map<string, string>;
    pageCount: number;
    fraudRiskLevel: FraudRiskLevel;
    fraudReport: string;
    uploader?: User;
}
