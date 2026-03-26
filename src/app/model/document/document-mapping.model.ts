import { UserMapping } from "../user/user-mapping.model";
import { DocumentType } from "./document-type.model";

export interface DocumentMapping {
    id: string;
    role: string;
    type: DocumentType;
    originalFilename: string;
    storagePath: string;
    extractedText: string;
    isIndexedForSearch: boolean;
    metadata: Record<string, string>;
    pageCount: number;
    fraudRiskLevel: string;
    fraudReport: string;
    uploader?: UserMapping;
}
