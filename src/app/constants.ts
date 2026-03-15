import { Type } from "@angular/core";
import { Archive } from "./archive/archive";
import { Documents } from "./documents/documents";
import { Home } from "./home/home";
import { Login } from "./login/login";
import { Profile } from "./profile/profile";
import { environment } from "../environments/environment";

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
    static baseUrl: string = 'https://isdox-dev-api.nicesea-47b40200.francecentral.azurecontainerapps.io/api/v1'
}