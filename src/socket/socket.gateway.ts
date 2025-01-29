import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { UsersService } from 'src/users/users.service';
import { Game } from 'src/game/classes/Game';
import { Riddle } from 'src/game/classes/Riddle';
import { CacheService } from 'src/cache/cache.service';
import { RecipeFunctions } from 'src/game/utilities/RecipeFunctions';
import { createMatrixFromArray } from 'src/shared/utilities/arrayFunctions';
import { ITip } from 'src/game/interfaces/ITip';
import { GameService } from 'src/game/game.service';
import { Maintenance } from 'src/admin/classes/Maintenance';
import { AchievementManager } from 'src/achievements/AchievementManager';
import { PrismaService } from 'src/prisma/prisma.service';
import { AchievementsGateway } from 'src/achievements/achievements.gateway';

@WebSocketGateway({ cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SocketGateway.name);

  private server: Server;
  private reporter: NodeJS.Timeout | null = null;

  private static gameToClient: Map<string, Game> = new Map();

  constructor(
    private readonly usersService: UsersService,
    private readonly cacheService: CacheService,
    private readonly maintenanceService: Maintenance,
    private readonly gameService: GameService,
    private readonly achievementManager: AchievementManager,
    private readonly achievementGateway: AchievementsGateway,
    private readonly prisma: PrismaService
  ) { }

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('Socket Gateway initialized!');
  }

  /**
 * Eltávolítja a gamet a socket ID alapján.
 * @param socketId - A socket ID.
 */
  removeUserBySocketId(socketId: string): void {
    const game = SocketGateway.gameToClient.get(socketId);
    if (game) {
      SocketGateway.gameToClient.delete(socketId);
    };
  };

  // Kliens csatlakozása
  async handleConnection(client: Socket) {
    const token = client.handshake.auth?.token;
    if (!token) {
      this.logger.error('Connection rejected: No token provided.');
      client.disconnect();
      return;
    }

    // Token validáció a UsersService-en keresztül
    const user = this.usersService.getUserByToken(token);
    //console.log(user);

    if (!user) {
      this.logger.error('Connection rejected: Invalid token.');
      client.disconnect();
      return;
    }

    // Socket ID társítása a UsersService-ben
    this.usersService.associateSocketId(token, client.id);
    if(!user.isGuest){
      const achievements = await this.achievementManager.achievementEventListener(user.id, [{name: "regist", targets: ["regist"]}]);
      this.achievementGateway.emitAchievements(client.id, achievements)
    }
    this.logger.log(`Client connected: ${client.id} (User: ${user.username})`);
    const maintenance = await this.maintenanceService.getCurrentMaintenance();
    client.emit('maintenance', maintenance);

    if (maintenance.countdown != null) {
      clearTimeout(this.reporter);
      this.reporter = setTimeout(async () => {
        this.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
      }, (maintenance.countdown + 1) * 1000);
    }
  }

  // Kliens lecsatlakozása
  handleDisconnect(client: Socket) {
    // Felhasználó eltávolítása socket ID alapján
    const user = this.usersService.getUserBySocketId(client.id);
    if (user) {
      this.logger.log(`Client disconnected: ${client.id} (User: ${user.username})`);
      // Opció: törölheted a socketIdToUser map-ből, ha szükséges
    } else {
      this.logger.log(`Client disconnected: ${client.id} (No associated user found)`);
    }
  }

  // Egyedi események kezelése
  @SubscribeMessage('startGame')
  async handleNewGame(client: Socket, payload: { newGame: boolean, gamemode: number }) {
    const riddle = new Riddle(this.cacheService, this.gameService);
    const game = new Game(riddle, client.id, this.usersService);
    if(payload.newGame){
      riddle.initializeNewGame(payload.gamemode);
      game.id = await this.gameService.saveGame(game);
    } else{
      game.id = await riddle.initializeExistingGame(this.usersService.getUserBySocketId(client.id), payload.gamemode)
    }
    SocketGateway.gameToClient.set(client.id, game);

    client.emit('guess', riddle.toJSON());
  }

  // Broadcast üzenet küldése minden kliensnek
  broadcastEvent(eventName: string, payload: any) {
    this.server.emit(eventName, payload);
  }

  @SubscribeMessage('guess')
  async handleGuess(client: Socket, payload: ITip) {
    const game = SocketGateway.gameToClient.get(client.id);
    if (game && !game.riddle.guessedRecipes.includes(payload.item.id)) {
      const tippedMatrix = createMatrixFromArray(payload.table);
      const baseRecipe = RecipeFunctions.getRecipeById(payload.item.group, payload.item.id, this.cacheService);
      if ((game.riddle.gamemode == 1 && this.gameService.checkTutorialScript(payload.item.group, game.riddle.numberOfGuesses)) || game.riddle.gamemode != 1) {
        if(RecipeFunctions.validateRecipe(tippedMatrix, baseRecipe)){
          game.riddle.guessedRecipes.push(payload.item.id);
          game.riddle.numberOfGuesses++;
          const result = RecipeFunctions.compareTipWithRiddle(tippedMatrix, game.riddle);
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
          if(result.solved){
            game.riddle.solved = true
            await this.gameService.changeGameStatus(game.id);
            const gamemode = await this.prisma.gamemodes.findFirst({where: {id:Number(game.riddle.gamemode)}})
            const events = [
              {
                name: 'solve',
                targets: [gamemode.name]
              },
              {
                name: 'craft',
                targets: [game.riddle.recipe[0].id] 
              }
            ];
            const achievements = await this.achievementManager.achievementEventListener(game.user.id, events , game, payload);
            this.achievementGateway.emitAchievements(client.id, achievements);
            SocketGateway.gameToClient.delete(client.id)
          }
        }
        client.emit('guess', game.riddle.toJSON());
      }
    }
  }

  @SubscribeMessage('credits')
  async handleCredits(client: Socket){
    const user = this.usersService.getUserBySocketId(client.id);
    const achievements = await this.achievementManager.achievementEventListener(user.id, [{name: "credits", targets: ["watched"]}])
    this.achievementGateway.emitAchievements(client.id, achievements)
  }

  emitMaintenanceUpdate(maintenance: {
    started: boolean,
    countdown: number | null
  }) {
    console.log(maintenance);
    this.broadcastEvent('maintenance', maintenance);
    if (maintenance.countdown != null) {
      clearTimeout(this.reporter);
      this.reporter = setTimeout(async () => {
        this.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
      }, (maintenance.countdown + 1) * 1000);
    }
  }
}