import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from './decorators/public.decorator';

@ApiTags('App Infos')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('version')
  @Public()
  @ApiOperation({ summary: 'Get the current version of the Application' })
  @ApiResponse({
    status: 200, description: 'Return the current version of the Application', example: {
      version: "1.2.0",
      snapshot: "12w2d1v",
      minecraftVersion: "Java Edition 1.21.4",
      minecraftVersionName: "The Garden Awakens",
    }
  })
  async getVersion() {
    return await this.appService.getVersion();
  }

  @Get('patchNotes')
  @Public()
  @ApiOperation({ summary: 'Get the patch notes of the Application' })
  @ApiResponse({
    status: 200, description: 'Return the patch notes of the Application', example: {
      "data": [
        {
          "date": "Apr 27, 2024",
          "updates": {
            "server": {
              "version": "Alpha",
              "changes": [
                "Main game {{new|finished}}",
                "Hints {{new|added}}"
              ]
            },
            "reactEdition": {
              "version": "Alpha",
              "changes": [
                "Mobile version {{new|added}}",
                "Hints {{new|added}}"
              ]
            }
          }
        }
      ]
    }
  })
  async getPatchNotes() {
    return await this.appService.getPatchNotes();
  }

  @Get('credits')
  @Public()
  @ApiOperation({ summary: 'Get the credits of the Application' })
  @ApiResponse({
    status: 200, description: 'Return the credits of the Application', example: {
      "data": [
        {
          "title": "Creators",
          "credits": [
            {
              "credit": "Creator team",
              "members": [
                "Guideian Angel"
              ]
            },
            {
              "credit": "Idea",
              "members": [
                "Horváth Máté"
              ]
            },
            {
              "credit": "Backend",
              "members": [
                "Horváth Máté",
                "Fazekas Márton"
              ]
            },
            {
              "credit": "Database",
              "members": [
                "Horváth Máté",
                "Fazekas Márton"
              ]
            },
            {
              "credit": "Design",
              "members": [
                "Fazekas Márton"
              ]
            },
            {
              "credit": "Animations",
              "members": [
                "Fazekas Márton"
              ]
            }
          ]
        }
      ]
    }
  })
  async getCredits() {
    return await this.appService.getCredits();
  }
}
