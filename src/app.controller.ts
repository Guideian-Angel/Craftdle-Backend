import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('version')
  async getVersion() {
    return await this.appService.getVersion();
  }

  @Get('patchNotes')
  async getPatchNotes() {
    return await this.appService.getPatchNotes();
  }

  @Get('credits')
  async getCredits() {
    return await this.appService.getCredits();
  }
}
