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

@WebSocketGateway({ cors: true })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(SocketGateway.name);

  private server: Server;

  constructor(
    private readonly usersService: UsersService,
  ) {}

  afterInit(server: Server) {
    this.server = server;
    this.logger.log('Socket Gateway initialized!');
  }

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

    if (!user) {
      this.logger.error('Connection rejected: Invalid token.');
      client.disconnect();
      return;
    }

    // Socket ID társítása a UsersService-ben
    this.usersService.associateSocketId(token, client.id);
    this.logger.log(`Client connected: ${client.id} (User: ${user.username})`);
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
  handleNewGame(client: Socket, payload: { newGame: boolean, gamemode: number }): void {
    const cacheService = new CacheService();
    const riddle = new Riddle(payload.newGame, payload.gamemode, cacheService);
    const game = new Game(riddle, client.id, this.usersService);

    // Emit the game object back to the client or handle it as needed
    client.emit('gameCreated', riddle.toJSON());
  }

  // Broadcast üzenet küldése minden kliensnek
  broadcastEvent(eventName: string, payload: any) {
    this.server.emit(eventName, payload);
  }
}