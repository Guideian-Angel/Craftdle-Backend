import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { Maintenance } from './classes/Maintenance';
import { SocketGateway } from 'src/socket/socket.gateway';
import { LoginDataDto } from 'src/users/dtos/LoginData.dto';
import { EmailService } from 'src/email/email.service';
import { AddAdminRightsDto } from './dto/add-admin-rights.dto';
import { UpdateAdminRightsDto } from './dto/update-admin-rights.dto';
import { StatisticsService } from 'src/statistics/statistics.service';
import { CliService } from 'src/cli/cli.service';

@Controller('admins')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly maintenanceService: Maintenance,
        private readonly socketGateway: SocketGateway,
        private readonly emailService: EmailService,
        private readonly statisticsService: StatisticsService,
        private readonly cliService: CliService
    ) { }

    @Post("login")
    async login(@Body() loginDataDto: LoginDataDto) {
        try {
            const result = await this.adminService.login(loginDataDto);
            await this.emailService.sendAdminVerificationEmail(result.email, { code: result.code, name: result.name });
            return { token: result.token };
        } catch (err) {
            return { error: err.message }
        }
    }

    @Post("verifyAdmin")
    async verifyAdmin(@Headers('authorization') authHeader: string, @Body() body: { code: string}) {
        console.log(body.code);
        try {
            return await this.adminService.verifyAdmin(authHeader, body.code);
        } catch (err) {
            return { error: err.message }
        }
    }

    @Delete("login")
    logout(@Headers('authorization') authHeader: string) {
        try {
            return this.adminService.logout(authHeader);
        } catch (err) {
            return { error: err.message }
        }
    }

    @Get("maintenance")
    async getMaintenance(@Headers('authorization') authHeader: string) {
        try {
            return await this.maintenanceService.getAllMaintenance(authHeader);
        } catch (err) {
            return { error: err.message }
        }
    }

    @Post("maintenance")
    async createMaintenance(@Headers('authorization') authHeader: string, @Body() createMaintenanceDto: CreateMaintenanceDto) {
        try {
            const addedMaintenance = await this.maintenanceService.createMaintenance(createMaintenanceDto, authHeader);
            this.socketGateway.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
            return addedMaintenance;
        } catch (err) {
            return { error: err.message }
        }
    }

    @Patch("maintenance/:id")
    async updateMaintenance(@Headers('authorization') authHeader: string, @Param('id') id: string, @Body() createMaintenanceDto: CreateMaintenanceDto) {
        try {
            const updatedMaintenance = await this.maintenanceService.updateMaintenance(id, createMaintenanceDto, authHeader);
            this.socketGateway.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
            return updatedMaintenance;
        } catch (err) {
            return { error: err.message }
        }
    }

    @Delete("maintenance/:id")
    async deleteMaintenance(@Headers('authorization') authHeader: string, @Param('id') id: string) {
        try {
            const deletedMaintenance = await this.maintenanceService.deleteMaintenance(id, authHeader);
            this.socketGateway.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
            return deletedMaintenance;
        } catch (err) {
            return { error: err.message }
        }
    }

    @Get("admin")
    async getAdmins(@Headers('authorization') authHeader: string) {
        try {
            return await this.adminService.getAllAdmins(authHeader);
        } catch (err) {
            return { error: err.message }
        }
    }

    @Patch("admin/:id")
    async updateAdmin(@Headers('authorization') authHeader: string, @Param('id') id: string, @Body() body: UpdateAdminRightsDto) {
        try {
            return await this.adminService.updateAdmin(+id, authHeader, body);
        } catch (err) {
            return { error: err.message }
        }
    }

    @Get("users")
    async getUsers(@Headers('authorization') authHeader: string) {
        try {
            return await this.adminService.getAllUsers(authHeader);
        } catch (err) {
            return { error: err.message }
        }
    }

    @Get("user/:id")
    async getUser(@Headers('authorization') authHeader: string, @Param('id') id: string) {
        try {
            return await this.adminService.getUser(+id, authHeader);
        } catch (err) {
            return { error: err.message }
        }
    }

    @Get("statistics")
    async getStatistics(@Headers('authorization') authHeader: string) {
        try {
            return await this.statisticsService.getStatistics(authHeader);
        } catch (err) {
            return { error: err.message }
        }
    }

    @Get("cli")
    async getCommands(@Headers('authorization') authHeader: string) {
        try {
            return await this.cliService.getCommands(authHeader);
        } catch (err) {
            return { error: err.message }
        }
    }

    @Post("cli")
    async executeCommand(@Headers('authorization') authHeader: string, @Body() body: { command: string }) {
        try {
            return await this.cliService.executeCommand(authHeader, body.command);
        } catch (err) {
            return { error: err.message }
        }
    }
}