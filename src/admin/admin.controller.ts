import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { Maintenance } from './classes/Maintenance';
import { SocketGateway } from 'src/socket/socket.gateway';
import { LoginDataDto } from 'src/users/dtos/LoginData.dto';

@Controller('admins')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly maintenanceService: Maintenance,
    private readonly socketGateway: SocketGateway
  ) {}

  @Post("login")
  async login(@Body() loginDataDto: LoginDataDto) {
    try{
      return await this.adminService.login(loginDataDto);
    } catch (err) {
      return {error: err.message}
    }
  }

  @Delete("login")
  logout(@Headers('authorization') authHeader: string) {
    try{
      return this.adminService.logout(authHeader);
    } catch (err) {
      return {error: err.message}
    }
  }

  @Post("maintenance")
  async createMaintenance(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    const addedMaintenance = await this.maintenanceService.createMaintenance(createMaintenanceDto);
    const upcomingMaintenance = await this.maintenanceService.getUpcomingMaintenance();
    this.socketGateway.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
    return addedMaintenance;
  }
}
