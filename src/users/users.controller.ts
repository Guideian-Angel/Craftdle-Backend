import { Controller, Get, Post, UnauthorizedException, Body, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDataDto } from './dtos/LoginData.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Get('login')
    async createGuestAccount() {
        try {
            this.usersService.loginWithGuestAccount();
        } catch (err) {
            throw new UnauthorizedException();
        }
    }

    @Post('login')
    async login(
        @Headers('authorization') authorization: string,
        @Body() body: LoginDataDto
    ) {
        try {
            this.usersService.loginUser(authorization, body);
        } catch (err) {
            throw new UnauthorizedException();
        }
    }
}