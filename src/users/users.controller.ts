import { Controller, Get, Post, Put, Delete, Headers, Body, UnauthorizedException, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from '../shared/interfaces/APIResponse'
import { LoginDataDto } from './dtos/LoginData.dto';
import { RegistDataDto } from './dtos/RegistData.dto';
import { UpdateSettingsDto } from './dtos/SettingsData.dto';
import { ISettings } from './interfaces/ISettings';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}


    //######################################################### USER LOGIN/REGIST ENDPOINTS #########################################################

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
            console.log(body)
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


    //######################################################### SETTINGS ENDPOINTS #########################################################

    @Get('settings')
    async getSettings(@Headers('authorization') authorization: string,): Promise<ApiResponse> {
        try{
            const result: ISettings[] = await this.usersService.collectSettings(authorization);

            return {data: result};
        } catch(err){
            return { message: err.message}
        }
    }

    @Put('settings/:id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async updateSettings(
        @Param('id') settingsId: number,
        @Headers('authorization') authorization: string,
        @Body() updateSettingsData: UpdateSettingsDto,
    ) {
        try{
            await this.usersService.updateSettings(settingsId, authorization, updateSettingsData);
        } catch(err){
            return { message: err.message}
        }
    }
}
