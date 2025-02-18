import { Controller, Get, Post, Body, Patch, Param, Delete, Headers } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { Maintenance } from './classes/Maintenance';
import { SocketGateway } from 'src/socket/socket.gateway';

@Controller('admins')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly maintenanceService: Maintenance,
    private readonly socketGateway: SocketGateway
  ) {}

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }

  @Post("maintenance")
  async createMaintenance(@Body() createMaintenanceDto: CreateMaintenanceDto) {
    const addedMaintenance = await this.maintenanceService.createMaintenance(createMaintenanceDto);
    const upcomingMaintenance = await this.maintenanceService.getUpcomingMaintenance();
    this.socketGateway.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
    return addedMaintenance;
  }
}
