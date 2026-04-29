import { DossierMapping } from "../dossier/dossier-mapping.model";

export interface ChatMessageMapping {
    text: string;
    referencedDossiers: DossierMapping[];
}
