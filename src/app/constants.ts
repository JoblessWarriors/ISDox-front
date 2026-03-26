import { Type } from "@angular/core";
import { Archive } from "./archive/archive";
import { Home } from "./home/home";
import { Login } from "./login/login";
import { Profile } from "./profile/profile";
import { environment } from "../environments/environment";
import { Documents } from "./document-related/documents/documents";

export class Constants {
    static defaultPage = 'home';
    static availableLanguages: string[] = ['en-US', 'ro'];
    static fallbackLanguage: string = 'en-US';
    static availableEndpoints: string[] = [
        'home',
        'documents',
        'archive',
        'profile',
        'login'
    ];
    static readonly endpointComponentMapping = new Map<string, Type<any>>([
        ['home', Home],
        ['documents', Documents],
        ['archive', Archive],
        ['profile', Profile],
        ['login', Login]
    ]);
    static readonly endpointLoggedInGuardMapping = new Map<string, boolean>([
        ['home', false],
        ['documents', true],
        ['archive', true],
        ['profile', true],
        ['login', false]
    ]);
    static baseUrl: string = environment.apiUrl;
}