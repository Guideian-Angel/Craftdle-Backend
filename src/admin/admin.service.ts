import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';
import { GameService } from 'src/game/game.service';
import { AssetsService } from 'src/assets/assets.service';
import { LoginDataDto } from 'src/users/dtos/login.dto';
import { getCurrentDate } from 'src/sharedComponents/utilities/date.util';
import { UpdateAdminRightsDto } from './dto/updateAdminRights.dto';
import { getStreak } from 'src/users/utilities/user.util';
import { AuthorizationService } from 'src/authorization/authorization.service';
import { CacheService } from 'src/cache/cache.service';
import { User } from 'src/users/classes/user.class';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly gameService: GameService,
    private readonly assetsService: AssetsService,
    private readonly authorizationService: AuthorizationService,
    private readonly cacheService: CacheService,
  ) {}

  generateVerificationCode() {
    return Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)).join('');
  }

  private isAdmin(user: User) {
    for (const rightName of Object.keys(user.adminRights)) {
      if (user.adminRights[rightName]) {
        return true;
      }
    }
    return false;
  }

  async login(loginDataDto: LoginDataDto) {
    try {
      if (!await this.usersService.findEmail(loginDataDto.usernameOrEmail)) {
        throw new HttpException('User not found with this email', HttpStatus.NOT_FOUND);
      }
      const user = await this.usersService.loginUser({
        ...loginDataDto,
        stayLoggedIn: false
      });
      if (!('id' in user)) {
        throw new HttpException('User does not have an id property', HttpStatus.BAD_REQUEST);
      }
      const admin = await this.cacheService.getUserByToken(user.loginToken);
      if(!this.isAdmin(admin)){
        throw new HttpException('You are not an admin', HttpStatus.UNAUTHORIZED);
      }
      const code = this.generateVerificationCode();
      admin.adminVerification = {
        code,
        expiration: new Date(getCurrentDate().setMinutes(getCurrentDate().getMinutes() + 10)),
        verified: false,
      };
      return {
        token: admin.token,
        name: admin.username,
        email: loginDataDto.usernameOrEmail,
        code,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async verifyAdmin(authHeader: string, code: string) {
    try {
      const admin = await this.cacheService.getUserByToken(authHeader.replace('Bearer ', ''));
      if (admin.adminVerification?.code !== code) {
        throw new HttpException('Invalid code', HttpStatus.BAD_REQUEST);
      }
      if (admin.adminVerification?.expiration < getCurrentDate()) {
        throw new HttpException('Code expired', HttpStatus.GONE);
      }
      if(!this.isAdmin(admin)){
        throw new HttpException('You are not an admin', HttpStatus.UNAUTHORIZED);
      }
      admin.adminVerification.verified = true;
      return admin;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  logout(authHeader: string) {
    try {
      return this.usersService.logoutUser(authHeader);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async convertAdminRights(adminRights: UpdateAdminRightsDto) {
    const result: string[] = [];

    Object.keys(adminRights).forEach(key => {
      if (adminRights[key]) {
        result.push(key);
      }
    })

    return result;
  }

  async getAllAdmins(authHeader: string) {
    try {
      const users = await this.getAllUsers(authHeader);
      const filtered = users.filter(user => user.rights.length !== 0);
      return filtered
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAdmin(userId: number, authHeader: string, body: UpdateAdminRightsDto) {
    try {
      const user = await this.cacheService.getUserByToken(authHeader.replace('Bearer ', ''));
      if (!user?.adminVerification?.verified) {
        throw new HttpException('You are not verified', HttpStatus.UNAUTHORIZED);
      }
      if (user.id == userId) {
        throw new HttpException('You cannot modify yourself', HttpStatus.BAD_REQUEST);
      }
      
      const adminRightsNames = await this.convertAdminRights(body);

      const adminRights = (await this.prisma.rights.findMany({ where: { name: { in: adminRightsNames } } })).map(right => right.id);

      const rights = await this.prisma.users_rights.findMany({
        where: {
          user: userId
        }
      });

      await this.prisma.users_rights.deleteMany({
        where: {
          right: {
            notIn: adminRights.filter(() => !rights.map(r => !adminRights.includes(r.right)))
          },
          user: userId
        }
      })

      await this.prisma.users_rights.createMany({
        data: adminRights.map(right => {
          return {
            user: userId,
            right: right
          }
        })
      })
    } catch (err) {
      throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllUsers(authHeader: string) {
    try {
      const user = await this.cacheService.getUserByToken(authHeader.replace('Bearer ', ''));

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
        const rights = await this.authorizationService.getAdminRights(userData.id);
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
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getUser(userId: number, authHeader: string) {
    try {
      const user = await this.cacheService.getUserByToken(authHeader.replace('Bearer ', ''));
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
        streak: await getStreak(userData.id, this.prisma),
        achievements: { collected: collectedAchievements, total: totalAchievements },
        collection: { collected: collectedItems, total: totalItems },
        favoriteGamemode: favoriteGamemode?.gamemodeName || "None",
        playedGamemodes: statistics
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}