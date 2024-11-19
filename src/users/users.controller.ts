import { Controller, Get, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('login')
    async createGuestAccount() {
        try {
            this.usersService.createGuestAccount();
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}