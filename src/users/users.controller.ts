import { Controller, Get, Post, Put, Delete, Body, UnauthorizedException, Param, Headers, HttpException, HttpStatus, Render, Query, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDataDto } from './dtos/login.dto';
import { RegistDataDto } from './dtos/regist.dto';
import { EmailService } from 'src/email/email.service';
import { EmailGateway } from 'src/email/email.gateway';
import { SettingsService } from 'src/settings/settings.service';
import { AssetsService } from 'src/assets/assets.service';
import { ApiResponse as IApiResponse } from 'src/sharedComponents/interfaces/response.interface';
import { UpdateSettingsDto } from 'src/settings/dtos/settings.dto';
import { ProfileAssetsDataDto } from 'src/assets/dtos/profileAssets.dto';
import { ApiBody, ApiHeader, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { UserDataDto } from './dtos/userData.dto';
import { CollectionDataDto } from 'src/assets/dtos/collection.dto';
import { UserStatsDto } from './dtos/userStats.dto';
import { PasswordResetDto, PasswordResetResponseDto } from './dtos/passwordReset.dto';
import { PasswordResetMessageDto } from './dtos/passwordResetMessage.dto';
import { PasswordChangeDto } from './dtos/passwordChange.dto';
import { Public } from 'src/decorators/public.decorator';
import { ApiResponseWrapper } from 'src/sharedComponents/classes/apiResponse.class';

@Controller('users')
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly emailService: EmailService,
        private readonly emailGateway: EmailGateway,
        private readonly settingsService: SettingsService,
        private readonly assetsService: AssetsService
    ) { }

    //######################################################### USER LOGIN/REGIST ENDPOINTS #########################################################

    /**
     * Regisztrációs végpont, amely új felhasználót hoz létre, vagy hibaüzenetet ad vissza.
     * @param userDto Az új felhasználó adatai (DTO formában).
     * @returns API válasz: siker esetén az új felhasználó adatai, hiba esetén az üzenet.
     */
    @Post('register')
    @Public()
    @ApiOperation({ summary: 'Register a new User' })
    @ApiBody({ type: RegistDataDto })
    @ApiResponseWrapper(UserDataDto)
    async register(@Body() userDto: RegistDataDto): Promise<IApiResponse> {
        try {
            const result = await this.usersService.register(userDto);
            if (!('loginToken' in result)) {
                throw new HttpException({ errors: result }, HttpStatus.BAD_REQUEST);
            }
            return { data: result }; 
        } catch (err) {
            throw new HttpException(
                { message: err.response || err.message },
                err.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Guest account létrehozása olyan felhasználók számára, akik nem rendelkeznek állandó fiókkal.
     * @returns {Promise<IApiResponse>} Guest account adatai vagy hibaüzenet.
     */
    @Get('login')
    @Public()
    @ApiOperation({ summary: 'Create a Guest Account' })
    @ApiResponseWrapper(UserDataDto)
    async createGuestAccount(): Promise<IApiResponse> {
        try {
            const result = await this.usersService.loginWithGuestAccount();
            return { data: result };
        } catch (err) {
            throw new HttpException(
                { message: err.response},
                err.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Bejelentkezési végpont, amely Bearer tokent fogad.
     * @param authorization - Az `authorization` header tartalma.
     * @returns API válasz: sikeres bejelentkezés esetén a felhasználói adatokkal.
     * @throws UnauthorizedException ha hibás a bejelentkezés.
     */
    @Post('autoLogin')
    @Public()
    @ApiOperation({ summary: 'Auto Login a User' })
    @ApiHeader({ name: 'authorization', required: true })
    @ApiResponse({ status: 200, description: 'Return the User data', type: UserDataDto })
    async autoLogin(@Headers('authorization') authorization: string) {
        try {
            const result = await this.usersService.autoLogin(authorization);
            return { data: result };
        } catch (err) {
            throw new HttpException(
                { message: err.response},
                err.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Bejelentkezési végpont, amely felhasználónév/jelszó párost fogad.
     * @param body - A `LoginDataDto` objektum, amely tartalmazza a bejelentkezési adatokat.
     * @returns API válasz: sikeres bejelentkezés esetén a felhasználói adatokkal.
     * @throws UnauthorizedException ha hibás a bejelentkezés.
     */
    @Post('login')
    @Public()
    @ApiOperation({ summary: 'Login a User' })
    @ApiBody({ type: LoginDataDto, required: true })
    @ApiResponse({ status: 200, description: 'Return the User data', type: UserDataDto })
    async login(@Body() body: LoginDataDto) {
        try {
            const result = await this.usersService.loginUser(body);
            return { data: result }; 
        } catch (err) {
            throw new UnauthorizedException(
                { message: err.response },
                err.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Kijelentkezési végpont, amely Basic Auth `username:token` alapján validálja a felhasználót.
     * A valid tokennel rendelkező felhasználók tokenje törlésre kerül az adatbázisból.
     * A felhasználó adatai megmaradnak statisztikai célok miatt.
     * @param authHeader - Az `authorization` fejléc tartalma.
     * @returns Üzenet a kijelentkezési folyamat eredményéről.
     */
    @Delete('login')
    @ApiOperation({ summary: 'Logout a User' })
    @ApiHeader({ name: 'authorization' })
    @ApiResponse({ status: 200, description: 'Return a message about the logout' })
    async logoutUser(@Headers('authorization') authHeader: string): Promise<IApiResponse> {
        try {
            await this.usersService.logoutUser(authHeader);
            return { message: 'Logout successful' };
        } catch (err) {
            throw new HttpException(
                { message: err.response},
                err.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    //######################################################### USER'S SETTINGS ENDPOINTS #########################################################

    /**
     * Felhasználó beállításainak lekérdezése (settings).
     * @param {string} authorization - A Bearer token azonosításhoz az Authorization fejlécben.
     * @returns {Promise<IApiResponse>} - A felhasználó beállításai vagy hibaüzenet.
     */
    @Get('settings')
    @ApiOperation({ summary: 'Get the User Settings' })
    @ApiHeader({ name: 'authorization'})
    @ApiResponseWrapper(UpdateSettingsDto)
    async getSettings(@Headers('authorization') authorization: string): Promise<IApiResponse> {
        try {
            const result = await this.settingsService.collectSettings(authorization);
            return { data: result }; 
        } catch (err) {
            throw new UnauthorizedException();
        }
    }

    /**
     * A felhasználói beállítások módosítása a beállítás azonosítója és az új adatok alapján.
     * @param {number} settingsId - A módosítandó beállítások egyedi azonosítója.
     * @param {string} authorization - Az autentikációs fejléc, amely tartalmazza a Bearer tokent.
     * @param {UpdateSettingsDto} updateSettingsData - Az új beállításokat tartalmazó adatok.
     * @returns {IApiResponse} - A sikeres művelet után egy üzenetet tartalmazó válasz.
     * @throws {HttpException} - Ha a token érvénytelen, vagy ha valamilyen hiba történik a beállítások módosítása során.
     */
    @Put('settings/:id')
    @ApiOperation({ summary: 'Update the User Settings' })
    @ApiHeader({ name: 'authorization' })
    @ApiBody({ type: UpdateSettingsDto })
    @ApiResponse({ status: 200, description: 'Return a message about the settings update' })
    async updateSettings(@Param('id') settingsId: number, @Headers('authorization') authorization: string, @Body() updateSettingsData: UpdateSettingsDto) {
        try {
            await this.settingsService.modifySettings(settingsId, authorization, updateSettingsData);
            return { message: "Settings successfully changed" }
        } catch (err) {
            throw new UnauthorizedException();
        }
    }


    //######################################################### USER'S ASSETS ENDPOINTS #########################################################

    /**
     * A felhasználó gyűjteményének lekérdezése.
     * @param authorization - A Bearer token azonosításhoz.
     * @returns A felhasználó gyűjteménye.
     */
    @Get('collection')
    @ApiOperation({ summary: 'Get the User Collection' })
    @ApiHeader({ name: 'authorization' })
    @ApiResponseWrapper(CollectionDataDto)
    async getCollection(@Headers('authorization') authorization: string): Promise<IApiResponse> {
        try {
            const result = await this.assetsService.getCollection(authorization);
            return { data: result };
        } catch (err) {
            throw new UnauthorizedException();
        }
    }

    /**
     * A felhasználó profiljának frissítése.
     * @param authorization - A Bearer token azonosításhoz.
     * @param body - A frissítendő profil adatai.
     * @returns A frissített profil adatai.
     */
    @Put('profile')
    @ApiOperation({ summary: 'Update the User Profile' })
    @ApiHeader({ name: 'authorization' })
    @ApiBody({ type: ProfileAssetsDataDto })
    async updateProfile(@Headers('authorization') authorization: string, @Body() body: ProfileAssetsDataDto): Promise<IApiResponse> {
        try {
            const result = await this.assetsService.updateProfile(authorization, body);
            return { data: result };
        } catch (err) {
            throw new UnauthorizedException();
        }
    }

    /**
     * A felhasználó statisztikáinak lekérdezése.
     * @param authorization - A Bearer token azonosításhoz.
     * @returns A felhasználó statisztikái.
     */
    @Get('stats')
    @ApiOperation({ summary: 'Get the User Stats' })
    @ApiHeader({ name: 'authorization' })
    @ApiResponseWrapper(UserStatsDto)
    async getStats(@Headers('authorization') authorization: string): Promise<IApiResponse> {
        try {
            const result = await this.usersService.getStats(authorization)
            return { data: result }
        } catch (err) {
            throw new UnauthorizedException();
        }
    }

    //######################################################### PASSWORD RESET ENDPOINTS #########################################################

    /**
     * Jelszó visszaállító kérés küldése a felhasználónak emailben.
     * @param authorization - Az autentikációs token (opcionális).
     * @param body - A felhasználó email címe.
     * @returns A jelszó visszaállítási információ.
     */
    @Post('password')
    @ApiOperation({ summary: 'Request a Password Reset' })
    @ApiHeader({ name: 'authorization' })
    @ApiBody({ type: PasswordResetDto })
    @ApiResponseWrapper(PasswordResetResponseDto)
    async requestPasswordReset(@Headers('authorization') authorization: string, @Body() body: { email: string }): Promise<IApiResponse> {
        try {
            const result = await this.usersService.requestPasswordReset(authorization, body.email);
            const item = result.items.find(image => image.isRight)
            this.emailService.sendVerifyEmail(body.email, {name: result.name, token: result.token, items: result.items });
            return { data: { item: item } };
        } catch (err) {
            throw new HttpException(
                { message: err.response},
                err.status || HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Felhasználói ellenőrzés végrehajtása a token és id alapján a jelszó visszaállításához.
     * @param token - A jelszó visszaállító token.
     * @param id - A felhasználó egyedi azonosítója.
     * @returns A sikeres vagy sikertelen ellenőrzés üzenete.
     */
    @Get('userVerify')
    @Render('passwordResetResponse')
    @ApiOperation({ summary: 'Verify the User for Password Reset' })
    @ApiQuery({ name: 'token', required: true })
    @ApiQuery({ name: 'id', required: true })
    @ApiResponseWrapper(PasswordResetMessageDto)
    async verifyUser(@Query('token') token: string, @Query('id') id: string) {
        try {
            const result = await this.usersService.verifyUser(token, id);
            this.emailGateway.emitUserVerification(result.userId, result.token, result.success);
            return {
                text: result.text,
                color: result.color
            };
        } catch (err) {
            return { message: err.message };
        }
    }

    /**
     * Jelszó visszaállítása a felhasználó számára.
     * @param authorization - Az autentikációs token.
     * @param body - A jelszó visszaállításához szükséges token és az új jelszó.
     * @returns A sikeres jelszó változtatásról szóló üzenet.
     */
    @Put('password')
    @ApiOperation({ summary: 'Reset the User Password' })
    @ApiHeader({ name: 'authorization' })
    @ApiBody({ type: PasswordResetDto })
    async resetPassword(@Headers('authorization') authorization: string, @Body() body: PasswordChangeDto): Promise<IApiResponse> {
        try {
            return await this.usersService.resetPassword(authorization, body);
        } catch (err) {
            return { message: err.message };
        }
    }
}