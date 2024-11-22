import { Controller, Get, Delete, Headers } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from '../shared/interfaces/APIResponse'

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get('login')
    async createGuestAccount(): Promise<ApiResponse> {
        try {
            const result = await this.usersService.createGuestAccount();
            return { data: result };
        } catch (err) {
            return { message: err.message };
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
