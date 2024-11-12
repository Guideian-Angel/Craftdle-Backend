import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Get()
    async validateTokenTest()
    {
        console.log(await this.usersService.validateToken("testToken"));
    }
}
