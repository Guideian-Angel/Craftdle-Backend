import { WebSocketGateway } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { IAchievement } from './interfaces/achievement.interface';

@WebSocketGateway({ cors: true })
export class AchievementsGateway {

  private server: Server;

  afterInit(server: Server) {
    this.server = server;
  }

  async emitAchievements(userId: string, achievements: IAchievement[]) {
    if(achievements.length > 0){
      this.server.to(userId)?.emit("achievements", achievements);
    }
  }
}
