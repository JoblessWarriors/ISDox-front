import { Type } from "@angular/core";
import { Home } from "./home/home";
import { Login } from "./login/login";
import { environment } from "../environments/environment";
import { Profile } from "./profile-related/profile/profile";
import { DocumentLayout } from "./document-related/document-layout/document-layout";
import { Archive } from "./archive-related/archive/archive";
import { DoxiSearch } from "./doxi/doxi-search/doxi-search";

export class Constants {
    static defaultPage = 'home';
    static availableLanguages: string[] = ['en-US', 'ro'];
    static fallbackLanguage: string = 'en-US';
    static availableEndpoints: string[] = [
        'home',
        'documents',
        'archive',
        'profile',
        'login',
        'doxi'
    ];
    static readonly endpointComponentMapping = new Map<string, Type<any>>([
        ['home', Home],
        ['documents', DocumentLayout],
        ['archive', Archive],
        ['profile', Profile],
        ['login', Login],
        ['doxi', DoxiSearch]
    ]);
    static readonly endpointLoggedInGuardMapping = new Map<string, boolean>([
        ['home', false],
        ['documents', true],
        ['archive', true],
        ['profile', true],
        ['login', false],
        ['doxi', true]
    ]);
    static baseUrl: string = environment.apiUrl;
}