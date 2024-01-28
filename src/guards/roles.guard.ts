import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../users/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(
      'permissions',
      context.getHandler(),
    );

    if (!requiredPermissions) {
      // No specific permissions required, access granted
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user: User = request.currentUser;

    if (!user || !user.roles || user.roles.length === 0) {
      // User has no roles, access denied
      return false;
    }

    const allPermissions = user.roles.flatMap((role) =>
      role.permissions.map((permission) => permission.name),
    );

    // Check if the user has all the required permissions
    return requiredPermissions.every((permission) =>
      allPermissions.includes(permission),
    );
  }
}
