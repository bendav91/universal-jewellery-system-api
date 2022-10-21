import { SetMetadata } from '@nestjs/common';
import { ApiPermissions } from './permissions.types';

export const Permissions = (...permissions: ApiPermissions[]) =>
  SetMetadata('permissions', permissions);
