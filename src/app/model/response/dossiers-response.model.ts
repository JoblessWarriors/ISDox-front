import { DossierMapping } from "../dossier/dossier-mapping.model";
import { Page } from "./page.model";

export interface DossiersResponse {
    content: DossierMapping[],
    page: Page;
}
