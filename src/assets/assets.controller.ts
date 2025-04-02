import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { AssetsService } from './assets.service';
import * as path from 'path';
import * as fs from 'fs';
import { ApiExcludeEndpoint, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Public } from 'src/decorators/public.decorator';

@Controller("/assets")
export class AssetsController {
    constructor(private readonly assetsService: AssetsService) { }

    @Get(':type/:src')
    @Public()
    @ApiExcludeEndpoint()
    async getAssets(
        @Param("type") type: string,
        @Param("src") src: string,
        @Res() res: Response,
    ) {
        // Az elérési út módosítása, hogy a public mappában keresse
        const imagePath = path.join(__dirname, '../../../public/img', type, src);

        // Ellenőrizd, hogy a fájl létezik-e
        if (fs.existsSync(imagePath)) {
            return res.sendFile(imagePath); // Ha létezik, küldd el a fájlt
        } else {
            res.status(404).send('Fájl nem található');
        }
    }
}