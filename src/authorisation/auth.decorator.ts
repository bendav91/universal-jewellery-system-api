import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOAuth2 } from '@nestjs/swagger';
import { ApiPermissions } from './permissions.types';
import { PermissionsGuard } from './permissions.guard';
import { Permissions } from 'src/authorisation/permissions.decorator';

export function Auth(...permissions: ApiPermissions[]) {
  return applyDecorators(
    Permissions(...permissions),
    ApiOAuth2(permissions, 'Auth0'),
    UseGuards(AuthGuard('jwt'), PermissionsGuard),
  );
}
