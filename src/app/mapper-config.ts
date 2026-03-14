import { Institution } from "./model/institution/institution.model";
import { Mapper } from "./model/mapper/mapper";
import { IdentityType } from "./model/user/identity-type";
import { UserMapping } from "./model/user/user-mapping.model";
import { UserRole } from "./model/user/user-role";
import { User } from "./model/user/user.model";

export const initializeMappings = () => {
    Mapper.register<User, UserMapping>('UserToMapping', (u) => ({
        ...u,
        roles: u.roles?.map(role => UserRole[role]) || [],
        departmentIds: u.departments?.map(d => d.id).filter((id): id is string => !!id) || [],
        institutionId: u.institution?.id,
        identityType: IdentityType[u.identityType]
    }));

    Mapper.register<UserMapping, User>('MappingToUser', (m) => ({
        ...m,
        roles: m.roles?.map(roleStr => (UserRole as any)[roleStr]) || [],
        departments: m.departments || [],
        institution: m.institutionId ? { id: m.institutionId } as Institution : undefined,
        identityType: (IdentityType as any)[m.identityType],
    }));
};