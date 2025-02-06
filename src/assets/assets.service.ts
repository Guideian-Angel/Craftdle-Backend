import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'; // Updated import path

@Injectable()
export class AssetsService {
    constructor(private prisma: PrismaService) { }

    getPicture(type: string, src: string) {

    }

    async getAllProfilePictures() {
        try {
            return await this.prisma.profile_pictures.findMany();
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllProfileBorders() {
        try {
            return await this.prisma.profile_borders.findMany();
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getAllInventoryItems() {
        try {
            return await this.prisma.collections.findMany();
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    getAllAchievements() {
        try {
            return this.prisma.achievements.findMany();
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
