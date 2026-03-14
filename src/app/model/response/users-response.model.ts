import { UserMapping } from "../user/user-mapping.model";
import { Page } from "./page.model";

export interface UsersResponse {
    content: UserMapping[],
    page: Page;
}
