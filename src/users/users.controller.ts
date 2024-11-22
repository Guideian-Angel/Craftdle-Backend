import { Controller, Get, Post, Delete, Headers, Body, UnauthorizedException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from '../shared/interfaces/APIResponse'
import { LoginDataDto } from './dtos/LoginData.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('login')
    async createGuestAccount(): Promise<ApiResponse> {
        try {
            const result = await this.usersService.loginWithGuestAccount();
            return { data: result };
        } catch (err) {
            return { message: err.message };
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

    @Delete('login')
    async logoutUser(@Headers('authorization') authHeader: string): Promise<ApiResponse> {
        try {
            await this.usersService.logoutUser(authHeader);
            return { message: 'Logout successful' };
        } catch (err) {
            return { message: err.message };
        }
    }
}
