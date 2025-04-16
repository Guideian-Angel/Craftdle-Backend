import { Injectable } from '@nestjs/common';
import { CacheService } from 'src/cache/cache.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { getCurrentDate } from 'src/sharedComponents/utilities/date.util';
import { startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class StatisticsService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cacheService: CacheService
    ) { }

    async getStatistics(authHeader: string) {
        try {
            const user = await this.cacheService.getUserByToken(authHeader.replace('Bearer ', ''));
            if (!user?.adminVerification?.verified) {
                throw new Error('You are not verified');
            }

            const playedGames = await this.getActiveGamesToday();
            const totalGamesPlayed = await this.getPlayedGames();

            return {
                numberOfUsers: {
                    guests: await this.countGuests(),
                    registeredUsers: await this.countRegisteredUsers()
                },
                numberOfGames: await this.countGames(),
                numberOfActiveUsersToday: new Set(playedGames.map(game => game.id)).size,
                numberOfPlayedGamesToday: {
                    played: playedGames.length,
                    solved: playedGames.filter(game => game.is_solved).length
                },
                playedGames: {
                    solved: totalGamesPlayed.filter(game => game.is_solved).length,
                    unsolved: totalGamesPlayed.filter(game => !game.is_solved).length
                },
                gamemodes: await this.getGamemodesSortedByDate(),
                registrationsByDate: await this.getRegistrationsByDate()
            }
        } catch (err) {
            return { error: err.message }
        }
    }

    async countGuests() {
        return await this.prismaService.users.count({
            where: {
                is_guest: true
            }
        });
    }

    async countRegisteredUsers() {
        return await this.prismaService.users.count({
            where: {
                is_guest: false
            }
        });
    }

    async countGames() {
        return await this.prismaService.games.count();
    }

    async getActiveGamesToday() {
        const todayStart = startOfDay(getCurrentDate());
        const todayEnd = endOfDay(getCurrentDate());

        return await this.prismaService.games.findMany({
            where: {
                OR: [
                    {
                        date: {
                            gte: todayStart,
                            lte: todayEnd
                        }
                    },
                    {
                        tips: {
                            some: {
                                date: {
                                    gte: todayStart,
                                    lte: todayEnd
                                }
                            }
                        }
                    }
                ]
            },
            select: {
                id: true,
                is_solved: true
            }
        });
    }

    async getPlayedGames() {
        return await this.prismaService.games.findMany();
    }

    async getGamemodesSortedByDate() {
        const games = await this.prismaService.games.findMany({
            select: {
                date: true,
                gamemodes: {
                    select: {
                        name: true
                    }
                },
                tips: {
                    select: {
                        date: true
                    },
                    orderBy: {
                        date: 'desc'
                    }
                }
            },
            orderBy: {
                date: 'asc'
            }
        });

        const gamemodes: { [key: string]: { [key: string]: number } } = {};

        if (games.length > 0) {
            const startDate = new Date(games[0].tips[0]?.date || games[0].date);
            const endDate = new Date(games[games.length - 1].tips[0]?.date || games[games.length - 1].date);

            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                const formattedDate = date.toLocaleDateString();
                gamemodes[formattedDate] = {};
            }
        }

        games.forEach(game => {
            if (game.tips.length > 0) {
                const date = game.tips[0].date.toLocaleDateString();
                const gamemodeName = game.gamemodes.name;
                if (gamemodeName in gamemodes[date]) {
                    gamemodes[date][gamemodeName]++;
                } else {
                    gamemodes[date][gamemodeName] = 1;
                }
            }
        });

        return gamemodes;
    }

    async getRegistrationsByDate() {
        const users = await this.prismaService.users.findMany({
            select: {
                registration_date: true
            },
            where: {
                is_guest: false
            },
            orderBy: {
                registration_date: 'asc'
            }
        });

        const registrations: { [key: string]: number } = {};

        if (users.length > 0) {
            const startDate = new Date(users[0].registration_date);
            const endDate = new Date(users[users.length - 1].registration_date);

            for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
                const formattedDate = date.toLocaleDateString();
                registrations[formattedDate] = 0;
            }
        }

        users.forEach(user => {
            const date = user.registration_date.toLocaleDateString();
            registrations[date]++;
        });

        return registrations;
    }
}