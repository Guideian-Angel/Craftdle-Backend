import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) {}
    // I just put this here just in case someone needs it
    /*
    async getTokens() {
        return await this.prisma.tokens.findMany();
    }
    */

    // returns the user data associated with a user id
    async getUserById(userId: number) {
        return await this.prisma.users.findUnique({
            where: {
                id: userId
            }
        });
    }
    
    // returns EVERY token associated with a user
    async getTokensByUserId(userId: number) {
        return await this.prisma.tokens.findMany({
            where: {
                user: userId
            }
        });
    }

    // returns the user data associated a token if it's present in the database
    async validateToken(token: string) {
        let tokenQuery = await this.prisma.tokens.findFirst({
            where: {
                login_token: token
            }
        });
        console.log(tokenQuery);
        return await this.getUserById(tokenQuery.user);
    }
}
