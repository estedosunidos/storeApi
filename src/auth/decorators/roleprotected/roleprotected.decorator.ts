import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from 'src/auth/interfaces/validRole.interface';

export const META_ROLES='roles'
export const Roleprotected = (...args: ValidRoles[]) =>{
    return SetMetadata(META_ROLES, args);
} 
