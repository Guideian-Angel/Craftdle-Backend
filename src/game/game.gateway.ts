import { Server, Socket } from 'socket.io';
import { WebSocketGateway, SubscribeMessage } from '@nestjs/websockets';
import { AchievementsGateway } from 'src/achievements/achievements.gateway';
import { CacheService } from 'src/cache/cache.service';
import { Riddle } from 'src/riddles/classes/riddle.class';
import { UsersService } from 'src/users/users.service';
import { Game } from './classes/game.class';
import { RecipesService } from 'src/recipes/recipes.service';
import { GameService } from './game.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { ITip } from 'src/tip/interfaces/tip.interface';
import { createMatrixFromArray } from 'src/sharedComponents/utilities/array.util';
import { TipService } from 'src/tip/tip.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AssetsService } from 'src/assets/assets.service';
import { AchievementsCollection } from 'src/achievements/classes/achievementsCollection';
import { RiddlesService } from 'src/riddles/riddles.service';

@WebSocketGateway({ cors: true })
export class GameGateway {

  private server: Server;

  constructor(
    private readonly usersService: UsersService,
    private readonly cacheService: CacheService,
    private readonly recipesService: RecipesService,
    private readonly gameService: GameService,
    private readonly tipService: TipService,
    private readonly achievementGateway: AchievementsGateway,
    private readonly prisma: PrismaService,
    private readonly assetsService: AssetsService,
    private readonly riddlesService: RiddlesService
  ) { }

  afterInit(server: Server) {
    this.server = server;
  }

  @SubscribeMessage('startGame')
  async handleNewGame(client: Socket, payload: { newGame: boolean, gamemode: number }) {
    const riddle = new Riddle(this.cacheService, this.gameService, this.recipesService, this.riddlesService);
    const user = this.usersService.getUserBySocketId(client.id);
    const game = new Game(riddle, user);
    if (payload.newGame || payload.gamemode == 3 || user.isGuest) {
      await riddle.initializeNewGame(payload.gamemode, game);
    } else {
      game.id = await riddle.initializeExistingGame(this.usersService.getUserBySocketId(client.id), payload.gamemode)
    }
    SocketGateway.gameToClient.set(client.id, game);

    client.emit('guess', riddle.toJSON());
  }

  @SubscribeMessage('guess')
  async handleGuess(client: Socket, payload: ITip) {
    const game = SocketGateway.gameToClient.get(client.id);
    if (game && !game.riddle.guessedRecipes.includes(payload.item.id)) {
      const tippedMatrix = createMatrixFromArray(payload.table);
      const baseRecipe = this.recipesService.getRecipeById(payload.item.group, payload.item.id, this.cacheService);
      if (payload.item.group != "gaLogo0") {
        if ((game.riddle.gamemode == 1 && this.tipService.checkTutorialScript(payload.item.group, game.riddle.numberOfGuesses)) || game.riddle.gamemode != 1) {
          if (this.recipesService.validateRecipe(tippedMatrix, baseRecipe)) {
            game.riddle.guessedRecipes.push(payload.item.id);
            game.riddle.numberOfGuesses++;
            const result = this.recipesService.compareTipWithRiddle(tippedMatrix, game.riddle);
            const tip = {
              item: {
                id: baseRecipe.id,
                name: baseRecipe.name,
                src: baseRecipe.src
              },
              table: result.result,
              date: new Date()
            }
            game.riddle.tips.push(tip);
            await this.gameService.saveTip(tip, game.id);
            const achievementsCollection = new AchievementsCollection(this.prisma);
            let events = [
              {
                name: 'guess',
                targets: [payload.item.group]
              }
            ]
            if (result.solved) {
              achievementsCollection.addTemporalAchievementToList("Riddle solved!", tip.item.name, tip.item.src, 0, 3, game.user)
              game.riddle.solved = true
              await this.gameService.changeGameStatus(game.id);
              const gamemode = await this.prisma.gamemodes.findFirst({ where: { id: Number(game.riddle.gamemode) } })
              events.push({
                name: 'solve',
                targets: [gamemode.name]
              }, {
                name: 'craft',
                targets: [game.riddle.recipe[0].id]
              });
              if (game.riddle.gamemode != 1) {
                const collectionClaimed = await this.assetsService.addItemToCollection(game.user, game.riddle.tips[game.riddle.tips.length - 1].item);
                if (collectionClaimed && collectionClaimed.added) {
                  achievementsCollection.addTemporalAchievementToList("New item collected!", tip.item.name, tip.item.src, 0, 3, game.user)
                  events.push(collectionClaimed.event)
                }
              }
            }
            await achievementsCollection.achievementEventListener(game.user, events, game, payload);
            await this.achievementGateway.emitAchievements(client.id, achievementsCollection.achievementList);
            const { items, recipes, ...filteredRiddle } = game.riddle.toJSON();
            client.emit('guess', filteredRiddle);
            if (result.solved) {
              SocketGateway.gameToClient.delete(client.id)
            }
          }
        }
      }
      else {
        if (this.recipesService.compareShapelessRecipes(tippedMatrix, baseRecipe).solved) {
          const achievementsCollection = new AchievementsCollection(this.prisma);
          await achievementsCollection.updateAchievementProgress(game.user.id, "guess", "ga", 1);
          await this.achievementGateway.emitAchievements(client.id, achievementsCollection.achievementList);
        }
      }
    }
  }
}