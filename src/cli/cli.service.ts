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
                    get: {
                        usage: '/get <type> <item_id>',
                        type: ['users', 'achievement', 'adminRights', 'collection', 'profileBorder', 'profilePicture', 'maintenance'],
                    },
                    set: {
                        usage: '/set <username> <type> <new_value>',
                        type: ['username', 'email', 'password']
                    },
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
                    }
                },
                resource: {
                    users: await this.prisma.users.findMany({ select: { id: true, username: true } }),
                    achievement: await this.prisma.achievements.findMany({ select: { id: true, title: true } }),
                    adminRights: await this.prisma.rights.findMany({ select: { id: true, name: true } }),
                    collection: await this.prisma.collections.findMany({ select: { id: true, item_id: true } }),
                    profileBorder: await this.prisma.profile_borders.findMany({ select: { id: true, name: true } }),
                    profilePicture: await this.prisma.profile_pictures.findMany({ select: { id: true, name: true } }),
                    maintenance: await this.prisma.maintenance.findMany({ select: { id: true } })
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
                case '/get':
                    return this.get(data);
                case '/set':
                    return this.set(data);
                case '/give':
                    return this.give(data);
                case '/remove':
                    return this.remove(data);
                case '/maintenance':
                    return this.maintenance(data, user.id);
                default:
                    throw new Error('Invalid command');
            }
        } catch (err) {
            return { error: err.message }
        }
    }

    private async get(data: string[]) {
        const [type, item] = data;
        switch (type) {
            case 'users':
                return await this.prisma.users.findMany({ select: { id: true, username: true, email: true, registration_date: true } });
            case 'achievement':
                return await this.prisma.achievements.findMany({ select: { id: true, title: true } });
            case 'adminRights':
                return await this.prisma.rights.findMany({ select: { id: true, name: true } });
            case 'collection':
                return await this.prisma.collections.findMany({ select: { id: true, item_id: true } });
            case 'profileBorder':
                return await this.prisma.profile_borders.findMany({ select: { id: true, name: true } });
            case 'profilePicture':
                return await this.prisma.profile_pictures.findMany({ select: { id: true, name: true } });
            case 'maintenance':
                return await this.prisma.maintenance.findMany({ select: { id: true, start: true, end: true } });
            default:
                throw new Error('Invalid type');
        }
    }

    private async set(data: string[]) {
        const [username, type, item] = data;
        const user = await this.prisma.users.findUnique({ where: { username: username } });
        switch (type) {
            case 'username':
                return await this.prisma.users.update({ where: { id: user.id }, data: { username: item } });
            case 'email':
                return await this.prisma.users.update({ where: { id: user.id }, data: { email: item } });
            case 'password':
                return await this.prisma.users.update({ where: { id: user.id }, data: { password: item } });
            default:
                throw new Error('Invalid type');
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
                const right = await this.prisma.rights.findUnique({ where: { name: item } });
                return await this.prisma.users_rights.create({
                    data: {
                        user: user.id,
                        right: right.id
                    }
                });
            case 'collection':
                const collection = await this.prisma.collections.findFirstOrThrow({ where: { item_id: item } })
                return await this.prisma.users_collections.create({
                    data: {
                        user: user.id,
                        collection: collection.id
                    }
                });
            case 'profileBorder':
                const profileBorder = await this.prisma.profile_borders.findFirstOrThrow({ where: { name: item } })
                return await this.prisma.users_profile_borders.create({
                    data: {
                        user: user.id,
                        profile_border: profileBorder.id,
                        is_set: false
                    }
                });
            case 'profilePicture':
                const profilePicture = await this.prisma.profile_pictures.findFirstOrThrow({ where: { name: item } })
                return await this.prisma.users_profile_pictures.create({
                    data: {
                        user: user.id,
                        profile_picture: profilePicture.id,
                        is_set: false
                    }
                });
            default:
                throw new Error('Invalid type');
        }
    }

    private async remove(data: string[]) {
        const [username, type, item] = data;
        const user = await this.prisma.users.findUnique({ where: { username: username } });
        switch (type) {
            case 'achievement':
                const achievement = await this.prisma.achievements.findUnique({ where: { title: item } })
                return await this.prisma.users_achievements.deleteMany({
                    where: {
                        user: user.id,
                        achievement: achievement.id
                    }
                });
            case 'adminRights':
                const right = await this.prisma.rights.findUnique({ where: { name: item } });
                return await this.prisma.users_rights.deleteMany({
                    where: {
                        user: user.id,
                        right: right.id
                    }
                });
            case 'collection':
                const collection = await this.prisma.collections.findFirstOrThrow({ where: { item_id: item } })
                return await this.prisma.users_collections.deleteMany({
                    where: {
                        user: user.id,
                        collection: collection.id
                    }
                });
            case 'profileBorder':
                const profileBorder = await this.prisma.profile_borders.findFirstOrThrow({ where: { name: item } })
                return await this.prisma.users_profile_borders.deleteMany({
                    where: {
                        user: user.id,
                        profile_border: profileBorder.id
                    }
                });
            case 'profilePicture':
                const profilePicture = await this.prisma.profile_pictures.findFirstOrThrow({ where: { name: item } })
                return await this.prisma.users_profile_pictures.deleteMany({
                    where: {
                        user: user.id,
                        profile_picture: profilePicture.id
                    }
                });
            default:
                throw new Error('Invalid type');
        }
    }

    private async maintenance(data: string[], userId: number) {
        const [operation, ...maintenanceData] = data;
        switch (operation) {
            case 'add':
                const [startAdd, endAdd] = maintenanceData;
                return await this.prisma.maintenance.create({ data: { start: new Date(startAdd), end: new Date(endAdd), user: userId } });
            case 'remove':
                const [maintenance_id] = maintenanceData;
                return await this.prisma.maintenance.delete({ where: { id: +maintenance_id } });
            case 'change':
                const [maintenanceIdChange, startChange, endChange] = maintenanceData;
                return await this.prisma.maintenance.update({ where: { id: +maintenanceIdChange }, data: { start: new Date(startChange), end: new Date(endChange), user: userId } });
            default:
                throw new Error('Invalid operation');
        }
    }
}