import { SetMetadata } from '@nestjs/common';

export const AccessPermissions = (...permissions: string[]) =>
  SetMetadata('permissions', permissions);
