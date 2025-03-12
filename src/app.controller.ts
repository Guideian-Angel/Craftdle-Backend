import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('App Infos')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('version')
  @ApiOperation({ summary: 'Get the current version of the Application' })
  @ApiResponse({ status: 200, description: 'Return the current version of the Application' })
  async getVersion() {
    return await this.appService.getVersion();
  }

  @Get('patchNotes')
  @ApiOperation({ summary: 'Get the patch notes of the Application' })
  @ApiResponse({ status: 200, description: 'Return the patch notes of the Application' })
  async getPatchNotes() {
    return await this.appService.getPatchNotes();
  }

  @Get('credits')
  @ApiOperation({ summary: 'Get the credits of the Application' })
  @ApiResponse({ status: 200, description: 'Return the credits of the Application'})
  async getCredits() {
    return await this.appService.getCredits();
  }
}
