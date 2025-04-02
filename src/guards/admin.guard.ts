import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthorizationService } from 'src/authorization/authorization.service';

@Injectable()
export class AdminGuard implements CanActivate {

    constructor(
        private readonly authorizationService: AuthorizationService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const userId = context.switchToHttp().getRequest().user;
        const userRoles = await this.authorizationService.getAdminRights(userId);
        console.log("User Roles: ", userRoles);

        let hasAdminRole = false;
        Object.values(userRoles).forEach(role => {
            if(role){
                hasAdminRole = true;
            }
        });

        return hasAdminRole;
    }
}