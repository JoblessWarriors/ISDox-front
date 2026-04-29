import { Dossier } from "../dossier/dossier.model";
import { User } from "../user/user.model";

export interface ChatMessage {
    text: string;
    dossiers?: Dossier[];
    sender?: string;
}
