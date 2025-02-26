import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { GameService } from 'src/game/game.service';
import { AssetsService } from 'src/assets/assets.service';
import { LoginDataDto } from 'src/users/dtos/login.dto';
import { AdminVerification } from 'src/users/classes/user.class';
import { getCurrentDate } from 'src/sharedComponents/utilities/date.util';
import { UpdateAdminRightsDto } from './dto/update-admin-rights.dto';
import { getStreak } from 'src/users/utilities/user.util';

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

  convertAdminRights(adminRights: UpdateAdminRightsDto) {
    const result: string[] = [];

    Object.keys(adminRights).forEach(key => {
      if (adminRights[key]) {
        result.push(key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));
      }
    })

    return result;
  }

  async getAllAdmins(authHeader: string) {
    try {
      const users = await this.getAllUsers(authHeader);
      const admins = users.filter(user => user.rights.length != 0)

      return admins
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

      const adminRightsNames = this.convertAdminRights(body);

      const adminRights = (await this.prisma.rights.findMany({ where: { name: { in: adminRightsNames } } })).map(right => right.id);

      await this.prisma.users_rights.deleteMany({
        where: {
          right: {
            notIn: adminRights
          },
          user: userId
        }
      })

      await this.prisma.users_rights.createMany({
        data: adminRights.map(right => {
          return {
            user: userId,
            right
          }
        })
      })
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
        }
      })

      return Promise.all(userDatas.map(async userData => {
        const rights = await this.usersService.getAdminRights(userData.id);
        const formatedRigths = Object.keys(rights).filter(rightName => rights[rightName]);
        const formatedUserData = {
          id: userData.id,
          username: userData.username? userData.username : 'Guest',
          rights: formatedRigths
        }

        return {
          ...formatedUserData,
          streak: await getStreak(userData.id, this.prisma),
          lastplayed: await this.gameService.getLastGameDate(userData.id),
        }
      }))
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

      const collectedAchievements = (await this.assetsService.getAchievements(userData.id)).filter(a => a.collected).length;
      const totalAchievements = (await this.assetsService.getAllAchievements()).length;

      const collectedItems = (await this.assetsService.getInventoryCollection(userData.id)).filter(c => c.collected).length;
      const totalItems = (await this.assetsService.getAllInventoryItems()).length;
      return {
        ...userData,
        streak: getStreak(userData.id, this.prisma),
        achievements: { collected: collectedAchievements, total: totalAchievements },
        collection: { collected: collectedItems, total: totalItems },
        favoriteGamemode: favoriteGamemode.gamemodeName,
        playedGamemodes: statistics
      };
    } catch (err) {
      throw new Error(err.message);
    }
  }
}