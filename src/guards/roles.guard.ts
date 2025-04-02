import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationService } from 'src/authorization/authorization.service';

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(
        private reflector: Reflector,
        private readonly authorizationService: AuthorizationService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.get<string[]>("roles", context.getHandler());
        const userId = context.switchToHttp().getRequest().user;
        const userRoles = await this.authorizationService.getAdminRights(userId);

        requiredRoles.forEach(role => {
            if (!userRoles[role]) {
                return false;
            }
        });

        return true;
    }
}