export interface TokenResponse {
    token: string; // claims: userId, roles, institutionId
    expiresIn: number;
}
