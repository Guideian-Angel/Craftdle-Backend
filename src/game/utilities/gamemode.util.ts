import { PrismaService } from '../../prisma/prisma.service';
import { IGamemode } from '../interfaces/game-gamemode';

export async function fetchGameModesWithLastUnsolvedGame(
    prisma: PrismaService,
    token: string
): Promise<IGamemode[]> {
    // 1. Token alapján a felhasználó id keresése
    const userId = await prisma.tokens.findFirst({
        where: { login_token: token.split('  ')[1] },   //ez itt nem végleges, csak a teszt miatt ilyen, holnap javítom
        select: { user: true },
    });
    console.log(token.split(':')[1], userId);

    if (!userId) {
        throw new Error('User not found.');
    }

    // 2. Gamemodes lekérdezése a Difficulty-vel együtt
    const gamemodes = await prisma.gamemodes.findMany({
        include: {
            difficulties: true,
        },
    });

    // 3. Felhasználó utolsó befejezetlen játékának lekérdezése
    const lastUnsolvedGame = await prisma.games.findFirst({
        where: {
            player: userId.user,
            is_solved: false,
        },
        orderBy: {
            date: 'desc',
        },
        select: {
            type: true,
        },
    });

    // 4. A visszaküldendő struktúra összeállítása
    return gamemodes.map((gamemode) => ({
        id: gamemode.id,
        icon: gamemode.icon,
        name: gamemode.name,
        description: gamemode.description,
        difficulty: {
            name: gamemode.difficulties.name,
            color_code: gamemode.difficulties.color_code,
        },
        continueGame: lastUnsolvedGame ? lastUnsolvedGame.type === gamemode.difficulty
            : null,
    }));
}