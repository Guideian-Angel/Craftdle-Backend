import { Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDataDto } from 'src/users/dtos/LoginData.dto';
import { UsersService } from 'src/users/users.service';
import { AdminVerification } from 'src/users/classes/user';
import { getCurrentDate } from 'src/shared/utilities/CurrentDate';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
        private readonly usersService: UsersService,
    ) { }

    generateVerificationCode() {
        let code = '';
        for (let i = 0; i < 6; i++) {
          code += Math.floor(Math.random() * 10); // Generál egy véletlen számjegyet (0–9)
        }
        return code;
      }

    async login(loginDataDto: LoginDataDto) {
        try {
            if(!await this.usersService.findEmail(loginDataDto.usernameOrEmail)){
                throw new Error('User not found with this email');
            }
            const user = await this.usersService.handleBodyLogin({
                ...loginDataDto,
                stayLoggedIn: false
            });
            if (!('id' in user)) {
                throw new Error('User does not have an id property');
            }
            const admin = await this.usersService.getUserByToken(user.loginToken);
            const code = this.generateVerificationCode();
            const adminVerification: AdminVerification = {
                code: code,
                expiration: new Date(getCurrentDate().setMinutes(getCurrentDate().getMinutes() + 10)),
                verified: false,
            }
            admin.adminVerification = adminVerification;
            return {
                token: admin.token,
                name: admin.username,
                email: loginDataDto.usernameOrEmail,
                code: code,
            };
        } catch (err) {
            throw err;
        }
    }

    async verifyAdmin(authHeader: string, code: string) {
        try{
            const admin = await this.usersService.getUserByToken(authHeader.replace('Bearer ', ''));
            if(admin.adminVerification?.code !== code){
                throw new Error('Invalid code');
            }
            if(admin.adminVerification?.expiration < getCurrentDate()){
                throw new Error('Code expired');
            }
            admin.adminVerification.verified = true;
            return admin
        } catch (err) {
            throw new Error(err.message);
        }
    }

    logout(authHeader: string) {
        try {
            return this.usersService.logoutUser(authHeader);
        } catch (err) {
            throw new Error(err.message);
        }
    }
}
