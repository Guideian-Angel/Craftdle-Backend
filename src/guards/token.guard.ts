import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TokenService } from 'src/token/token.service';

@Injectable()
export class TokenAuthGuard implements CanActivate {
    constructor(
        private reflector: Reflector,
        private readonly tokenService: TokenService
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const isPublic = this.reflector.get<boolean>("isPublic", context.getHandler());
        if (isPublic) {
            return true; // Ha az endpoint nyilvános, átengedi a kérést
        }

        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;
        console.log("Auth Header: ", authHeader);
    
        if (!authHeader) {
            throw new UnauthorizedException('Missing authorization header');
        }
    
        const user = await this.tokenService.validateBearerToken(authHeader); 
        console.log("User: ", user);
    
        if (!user) {
            throw new UnauthorizedException('Invalid or missing token');
        }
    
        request.user = user;
        return true;
    }
}