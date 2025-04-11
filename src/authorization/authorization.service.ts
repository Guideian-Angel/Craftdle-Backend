import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthorizationService {
    constructor(
        private readonly prisma: PrismaService,
    ) {}

    async getAdminRights(id: number) {
        try {
            const adminRights = (await this.prisma.users_rights.findMany({
                where: {
                    user: id
                },
                select: {
                    rights: {
                        select: {
                            name: true
                        }
                    }
                }
            })).map(right => right.rights.name);
            return {
                modifyUsers: adminRights.includes('modifyUsers'),
                modifyMaintenance: adminRights.includes('modifyMaintenance'),
                modifyAdmins: adminRights.includes('modifyAdmins'),
            }
        } catch (error) {
            return null;
        }
    }
}
