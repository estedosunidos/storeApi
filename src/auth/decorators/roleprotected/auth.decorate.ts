import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from 'src/auth/guards/user-role/user-role.guard';
import { ValidRoles } from 'src/auth/interfaces/validRole.interface';
import { Roleprotected } from './roleprotected.decorator';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    Roleprotected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),

  );
}