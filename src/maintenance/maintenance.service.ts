import { PrismaService } from "src/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateMaintenanceDto } from "./dto/createMaintenance.dto";
import { getCurrentDate } from "src/sharedComponents/utilities/date.util";
import { CacheService } from "src/cache/cache.service";

@Injectable()
export class MaintenanceService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly cacheService: CacheService,
    ) { }

    async createMaintenance(createMaintenanceDto: CreateMaintenanceDto, authHeader: string) {
        try {
            const token = authHeader.replace('Bearer ', '');

            const user = await this.cacheService.getUserByToken(token);

            if (!user?.adminRights?.modifyMaintenance) {
                throw new HttpException('You do not have permission to modify maintenance', HttpStatus.FORBIDDEN);
            }

            if (!user?.adminVerification?.verified) {
                throw new HttpException('You are not verified', HttpStatus.UNAUTHORIZED);
            }

            return await this.prisma.maintenance.create({
                data: {
                    user: user.id,
                    ...createMaintenanceDto
                }
            });
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getUpcomingMaintenance() {
        return this.prisma.maintenance.findFirst({
            where: {
                end: { gt: getCurrentDate() },
            },
            orderBy: {
                start: 'asc'
            },
        });
    }

    async getAllMaintenance(authHeader: string) {
        try {
            const token = authHeader.replace('Bearer ', '');
            const user = await this.cacheService.getUserByToken(token);
            if (!user) {
                throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
            }

            const maintenances = await this.prisma.maintenance.findMany({
                orderBy: {
                    start: 'asc'
                },
                include: {

                }
            });

            return maintenances.map(maintenance => {
                return {
                    ...maintenance,
                    active: maintenance.end > getCurrentDate()
                };
            })
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async getCurrentMaintenance() {
        const upcomingMaintenance = await this.getUpcomingMaintenance();
        if (!upcomingMaintenance) {
            return {
                started: false,
                countdown: null
            };
        }

        const now = getCurrentDate();

        const started = upcomingMaintenance.start < now;

        const countdown = Math.round((started ? (
            upcomingMaintenance.end.getTime() - now.getTime()
        ) : (
            upcomingMaintenance.start.getTime() - now.getTime()
        )) / 1000);

        return {
            started: started,
            countdown: countdown > 0 ? countdown : null
        };
    }

    async updateMaintenance(id: string, createMaintenanceDto: CreateMaintenanceDto, authHeader: string) {
        try {
            const token = authHeader.replace('Bearer ', '');

            const user = await this.cacheService.getUserByToken(token);

            if (!user?.adminRights?.modifyMaintenance) {
                throw new HttpException('You do not have permission to modify maintenance', HttpStatus.FORBIDDEN);
            }

            if (!user?.adminVerification?.verified) {
                throw new HttpException('You are not verified', HttpStatus.UNAUTHORIZED);
            }

            return await this.prisma.maintenance.update({
                where: {
                    id: parseInt(id)
                },
                data: {
                    user: user.id,
                    ...createMaintenanceDto
                }
            });
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteMaintenance(id: string, authHeader: string) {
        try {
            const token = authHeader.replace('Bearer ', '');

            const user = await this.cacheService.getUserByToken(token);

            if (!user?.adminRights?.modifyMaintenance) {
                throw new HttpException('You do not have permission to modify maintenance', HttpStatus.FORBIDDEN);
            }

            if (!user?.adminVerification?.verified) {
                throw new HttpException('You are not verified', HttpStatus.UNAUTHORIZED);
            }

            return await this.prisma.maintenance.delete({
                where: {
                    id: parseInt(id)
                }
            });
        } catch (err) {
            throw new HttpException(err.message, err.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}