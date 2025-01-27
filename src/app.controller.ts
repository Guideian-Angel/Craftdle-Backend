import { Controller, Get, Render } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/emailOverView')
  @Render('passwordResetEmail')
  async getEmailOverView() {
    const result = await this.appService.getEmailOverView();
    console.log(result);
    return {items: result, token: 'test1234'};
  }
}
