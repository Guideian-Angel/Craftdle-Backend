import { Controller, Get, Post, Put, Delete, Headers, Body, UnauthorizedException, UsePipes, ValidationPipe, Param, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiResponse } from '../shared/interfaces/APIResponse'
import { LoginDataDto } from './dtos/LoginData.dto';
import { RegistDataDto } from './dtos/RegistData.dto';
import { UpdateSettingsDto } from './dtos/SettingsData.dto';
import { ISettings } from './interfaces/ISettings';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }


    //######################################################### USER LOGIN/REGIST ENDPOINTS #########################################################

    @Post('register')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    /**
     * Regisztrációs végpont, amely új felhasználót hoz létre, vagy hibaüzenetet ad vissza.
     * @param userDto Az új felhasználó adatai (DTO formában).
     * @returns API válasz: siker esetén az új felhasználó adatai, hiba esetén az üzenet.
     */
    async register(@Body() userDto: RegistDataDto): Promise<ApiResponse> {
        try {
            const result = await this.usersService.register(userDto);

            if ('username' in result || 'email' in result) {
                // Ha van hiba (pl. foglalt felhasználónév vagy email), 400-as státusz.
                throw new HttpException({ errors: result }, HttpStatus.BAD_REQUEST);
            }

            return { data: result }; // Sikeres regisztráció válasza.
        } catch (err) {
            throw new HttpException(
                { message: err.response || err.message },
                err.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Guest account létrehozása olyan felhasználók számára, akik nem rendelkeznek állandó fiókkal.
     * @returns {Promise<ApiResponse>} Guest account adatai vagy hibaüzenet.
     */
    @Get('login')
    async createGuestAccount(): Promise<ApiResponse> {
        try {
            const result = await this.usersService.loginWithGuestAccount();
            return { data: result };
        } catch (err) {
            // Hiba kezelése, a részletek megjelenítése naplózásban
            console.error("Hiba történt vendégfiók létrehozásakor:", err.message);
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
        try {
            const result: ISettings[] = await this.usersService.collectSettings(authorization);

            return { data: result };
        } catch (err) {
            return { message: err.message }
        }
    }

    @Put('settings/:id')
    @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
    async updateSettings(
        @Param('id') settingsId: number,
        @Headers('authorization') authorization: string,
        @Body() updateSettingsData: UpdateSettingsDto,
    ) {
        try {
            await this.usersService.updateSettings(settingsId, authorization, updateSettingsData);
        } catch (err) {
            return { message: err.message }
        }
    }
}
