import { Controller, Get, Post, Delete, Headers, Body, UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from '../shared/interfaces/APIResponse'
import { LoginDataDto } from './dtos/LoginData.dto';
import { RegistDataDto } from './dtos/RegistData.dto';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async register(@Body() userDto: RegistDataDto): Promise<ApiResponse> {
        try {
            const result = await this.usersService.register(userDto);
    
            if (Object.keys(result).length >= 2) {
                return { message: result };
            }
    
            return { data: result };
        } catch (err) {
            return { message: err.response || err.message };
        }
    }

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
