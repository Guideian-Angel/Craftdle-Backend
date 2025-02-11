import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class CliService {
    constructor(
        private prisma: PrismaService,
        private readonly usersService: UsersService
    ) { }

    async getCommands(authHeader: string) {
        try {
            const user = await this.usersService.getUserByToken(authHeader.replace('Bearer ', ''));
            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            return {
                commands: {
                    give: {
                        usage: '/give <username> <type> <item_name>',
                        type: ['achievement', 'adminRights', 'collection', 'profileBorder', 'profilePicture'],
                    },
                    remove: {
                        usage: '/remove <username> <type> <item_name>',
                        type: ['achievement', 'adminRights', 'collection', 'profileBorder', 'profilePicture'],
                    },
                    maintenance: {
                        usage: '/maintenance <operation> <maintenane_data>',
                        operation: {
                            add: {
                                usage: '/maintenance add <start> <end>',
                            },
                            remove: {
                                usage: '/maintenance remove <maintenance_id>',
                            },
                            change: {
                                usage: '/maintenance change <maintenance_id> <start> <end>',
                            }
                        }
                    },
                    get: {
                        usage: '/get <type> <item_id>',
                        type: ['users', 'achievement', 'adminRights', 'collection', 'profileBorder', 'profilePicture', 'maintenance'],
                    },
                    set: {
                        usage: '/set <username> <type> <new_value>',
                        type: ['username', 'email', 'password']
                    }
                },
                resource: {
                    users: await this.prisma.users.findMany({ select: { id: true, username: true, email: true, registration_date: true } }),
                    achievement: await this.prisma.achievements.findMany({ select: { id: true, title: true } }),
                    adminRights: await this.prisma.rights.findMany({ select: { id: true, name: true } }),
                    collection: await this.prisma.collections.findMany({ select: { id: true, name: true } }),
                    profileBorder: await this.prisma.profile_borders.findMany({ select: { id: true, name: true } }),
                    profilePicture: await this.prisma.profile_pictures.findMany({ select: { id: true, name: true } }),
                    maintenance: await this.prisma.maintenance.findMany({ select: { id: true, start: true, end: true } })
                }
            }
        } catch (err) {
            return { error: err.message }
        }
    }

    async executeCommand(authHeader: string, command: string) {
        try {
            const user = await this.usersService.getUserByToken(authHeader.replace('Bearer ', ''));
            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            const [operation, ...data] = command.split(' ');
            switch (operation) {
                case '/give':
                    return this.give(data);
                case '/remove':
                    //return this.remove(data);
                case '/maintenance':
                    //return this.maintenance(data);
                case '/get':
                    //return this.get(data);
                case '/set':
                    //return this.set(data);
                default:
                    throw new Error('Invalid command');
            }
        } catch (err) {
            return { error: err.message }
        }
    }

    private async give(data: string[]) {
        const [username, type, item] = data;
        const user = await this.prisma.users.findUnique({ where: { username: username } });
        switch (type) {
            case 'achievement':
                const achievement = await this.prisma.achievements.findUnique({ where: { title: item } })
                return await this.prisma.users_achievements.create({
                    data: {
                        user: user.id,
                        achievement: achievement.id,
                        progress: achievement.goal
                    }
                });
            case 'adminRights':
                const rightId = (await this.prisma.rights.findUnique({ where: { name: item } })).id;
                return await this.prisma.users_rights.create({
                    data: {
                        user: user.id,
                        right: rightId
                    }
                });
            default:
                throw new Error('Invalid type');
        }
    }
}
