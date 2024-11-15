import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TokenValidationService {
    constructor(private readonly prisma: PrismaService) {}

    async getUserById(userId: number) {
        try {
            const user = await this.prisma.users.findUnique({
                where: { id: userId }
            });
            if (!user) {
                throw new Error(`User with ID ${userId} not found.`);
            }
            return user;
        } catch (error) {
            console.error("Error in getUserById:", error);
            throw new Error("Failed to retrieve user data.");
        }
    }

    async getTokensByUserId(userId: number) {
        try {
            return await this.prisma.tokens.findMany({
                where: { user: userId }
            });
        } catch (error) {
            console.error("Error in getTokensByUserId:", error);
            throw new Error("Failed to retrieve tokens.");
        }
    }

    async validateToken(token: string) {
        try {
            const tokenQuery = await this.prisma.tokens.findFirst({
                where: { login_token: token }
            });

            if (!tokenQuery) {
                throw new Error("Token not found.");
            }

            return await this.getUserById(tokenQuery.user);
        } catch (error) {
            console.error("Error in validateToken:", error);
            throw new Error("Failed to validate token.");
        }
    }
}