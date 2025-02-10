import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDataDto } from 'src/users/dtos/LoginData.dto';
import { UsersService } from 'src/users/users.service';
import { AdminRights, AdminVerification } from 'src/users/classes/user';
import { formatDate, getCurrentDate } from 'src/shared/utilities/Date';
import { AddAdminRightsDto } from './dto/add-admin-rights.dto';
import { UpdateAdminRightsDto } from './dto/update-admin-rights.dto';
import { GameService } from 'src/game/game.service';
import { AssetsService } from 'src/assets/assets.service';

@Injectable()
export class AdminService {
    constructor(
        private prisma: PrismaService,
        private readonly usersService: UsersService,
        private readonly gameService: GameService,
        private readonly assetsService: AssetsService
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
            if (!await this.usersService.findEmail(loginDataDto.usernameOrEmail)) {
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
        try {
            const admin = await this.usersService.getUserByToken(authHeader.replace('Bearer ', ''));
            if (admin.adminVerification?.code !== code) {
                throw new Error('Invalid code');
            }
            if (admin.adminVerification?.expiration < getCurrentDate()) {
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

    compareAdminRights(admin1: AdminRights, admin2: AddAdminRightsDto | UpdateAdminRightsDto) {
        const result = {};
        for (const admin1Key in admin1) {
            const admin2Key = admin1Key.replace(/[A-Z]/g, (match) => `_${match.toLowerCase()}`)
            if (admin2.hasOwnProperty(admin2Key)) {
                result[admin2Key] = admin1[admin1Key] && admin2[admin2Key];
            }
        }
        return result as AddAdminRightsDto;
    }

    async getAllAdmins(authHeader: string) {
        try {
            const user = await this.usersService.getUserByToken(authHeader.replace('Bearer ', ''));

            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            return this.prisma.users.findMany({
                select: {
                    id: true,
                    username: true,
                    email: true,
                    admin_rights: true
                },
                where: {
                    admin_rights: {
                        isNot: null
                    }
                }
            })
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async addAdmin(userId: number, authHeader: string, body: AddAdminRightsDto) {
        try {
            const user = await this.usersService.getUserByToken(authHeader.replace('Bearer ', ''));

            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            if (!user.adminRights?.modifyAdmins) {
                throw new Error('You do not have permission to modify admins');
            }

            return this.prisma.admin_rights.create({
                data: {
                    admin: userId,
                    ...this.compareAdminRights(user.adminRights, body)
                }
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async updateAdmin(userId: number, authHeader: string, body: UpdateAdminRightsDto) {
        try {
            const user = await this.usersService.getUserByToken(authHeader.replace('Bearer ', ''));

            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            if (!user.adminRights?.modifyAdmins) {
                throw new Error('You do not have permission to modify admins');
            }

            return this.prisma.admin_rights.update({
                where: {
                    admin: userId
                },
                data: this.compareAdminRights(user.adminRights, body)
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async deleteAdmin(userId: number, authHeader: string) {
        try {
            const user = await this.usersService.getUserByToken(authHeader.replace('Bearer ', ''));

            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            if (!user.adminRights?.modifyAdmins) {
                throw new Error('You do not have permission to modify admins');
            }

            return this.prisma.admin_rights.delete({
                where: {
                    admin: userId
                }
            });
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getAllUsers(authHeader: string) {
        try {
            const user = await this.usersService.getUserByToken(authHeader.replace('Bearer ', ''));

            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            const userDatas = await this.prisma.users.findMany({
                select: {
                    id: true,
                    username: true,
                    admin_rights: true
                }
            })

            return userDatas.map(userData => {
                return {
                    ...userData,
                    streak: this.gameService.getStreak(userData.id),
                    lastPlayed: this.gameService.getLastGameDate(userData.id),
                }
            })
        } catch (err) {
            throw new Error(err.message);
        }
    }

    async getUser(userId: number, authHeader: string) {
        try {
            const user = await this.usersService.getUserByToken(authHeader.replace('Bearer ', ''));
            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            const userData = await this.prisma.users.findUnique({
                where: { id: userId },
                select: {
                    id: true,
                    username: true,
                    registration_date: true
                }
            });

            const favoriteGamemode = await this.gameService.getFavoriteGamemode(userData.id);
            const statistics = await this.gameService.getUserStatistics(userData.id);

            const collectedAchievements = (await this.usersService.getAchievements(userData.id)).filter(a => a.collected).length;
            const totalAchievements = (await this.assetsService.getAllAchievements()).length;

            const collectedItems = (await this.usersService.getInventoryCollection(userData.id)).filter(c => c.collected).length;
            const totalItems = (await this.assetsService.getAllInventoryItems()).length;

            return {
                ...userData,
                streak: this.gameService.getStreak(userData.id),
                achievements: { collected: collectedAchievements, total: totalAchievements },
                collection: { collected: collectedItems, total: totalItems },
                favoriteGamemode: favoriteGamemode.name,
                playedGamemodes: statistics
            };
        } catch (err) {
            throw new Error(err.message);
        }
    }
}