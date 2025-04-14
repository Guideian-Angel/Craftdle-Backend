import { Controller, Get, Post, Body, Patch, Param, Delete, Headers, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { EmailService } from 'src/email/email.service';
import { StatisticsService } from 'src/statistics/statistics.service';
import { CliService } from 'src/cli/cli.service';
import { LoginDataDto } from 'src/users/dtos/login.dto';
import { CreateMaintenanceDto } from '../maintenance/dto/createMaintenance.dto';
import { UpdateAdminRightsDto } from './dto/updateAdminRights.dto';
import { Public } from 'src/decorators/public.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { RolesGuard } from 'src/guards/roles.guard';
import { AdminGuard } from 'src/guards/admin.guard';
import { MaintenanceService } from 'src/maintenance/maintenance.service';
import { LoginResponseDto } from './dto/loginResponse.dto';
import { AdminVerificationResponseDto } from './dto/adminVerificationResponse.dto';
import { MaintenanceResponseDto } from './dto/maintenanceResponse.dto';
import { UserListItemDto } from './dto/userResponse.dto';
import { UserStatsResponseDto } from './dto/userStatsResponse.dto';
import { SystemStatsResponseDto } from './dto/systemStatsResponse.dto';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly maintenanceService: MaintenanceService,
    private readonly socketGateway: SocketGateway,
    private readonly emailService: EmailService,
    private readonly statisticsService: StatisticsService,
    private readonly cliService: CliService
  ) { }

  @Post("login")
  @Public()
  @ApiOperation({ summary: 'Admin login' })
  @ApiBody({ type: LoginDataDto })
  @ApiResponse({ status: 200, description: 'Login successful, returns token.', type: LoginResponseDto })
  @ApiResponse({ status: 404, description: 'User not found.' })
  async login(@Body() loginDataDto: LoginDataDto) {
    const result = await this.adminService.login(loginDataDto);
    await this.emailService.sendAdminVerificationEmail(result.email, { code: result.code, name: result.name });
    return { token: result.token };
  }

  @Post("verifyAdmin")
  @Public()
  @ApiOperation({ summary: 'Verify admin using a code' })
  @ApiBody({ schema: { properties: { code: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Returns logged in user data', type: AdminVerificationResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid code.' })
  @ApiResponse({ status: 410, description: 'Code expired.' })
  async verifyAdmin(@Headers('authorization') authHeader: string, @Body() body: { code: string }) {
    return this.adminService.verifyAdmin(authHeader, body.code);
  }

  @Delete("login")
  @ApiOperation({ summary: 'Logout admin' })
  @ApiResponse({ status: 200, description: 'Logout successful.' })
  logout(@Headers('authorization') authHeader: string) {
    return this.adminService.logout(authHeader);
  }

  @Get("maintenance")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all maintenance records' })
  @ApiResponse({ status: 200, description: 'List of maintenance periods', type: MaintenanceResponseDto, isArray: true,})
  async getMaintenance(@Headers('authorization') authHeader: string) {
    const data = await this.maintenanceService.getAllMaintenance(authHeader);
    console.log("Fasz: ", data, " fasz")
    return data;
  }

  @Post("maintenance")
  @Roles(["modifyMaintenance"])
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create a maintenance record' })
  @ApiBody({ type: CreateMaintenanceDto })
  @ApiResponse({ status: 201, description: 'Maintenance record created.', type: MaintenanceResponseDto})
  async createMaintenance(@Headers('authorization') authHeader: string, @Body() createMaintenanceDto: CreateMaintenanceDto) {
    const addedMaintenance = await this.maintenanceService.createMaintenance(createMaintenanceDto, authHeader);
    this.socketGateway.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
    return addedMaintenance;
  }

  @Patch("maintenance/:id")
  @Roles(["modifyMaintenance"])
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Update a maintenance record' })
  @ApiParam({ name: 'id', type: 'string', description: 'Maintenance ID' })
  @ApiBody({ type: CreateMaintenanceDto })
  @ApiResponse({ status: 200, description: 'Maintenance record updated.', type: MaintenanceResponseDto})
  async updateMaintenance(@Headers('authorization') authHeader: string, @Param('id') id: string, @Body() createMaintenanceDto: CreateMaintenanceDto) {
    const updatedMaintenance = await this.maintenanceService.updateMaintenance(id, createMaintenanceDto, authHeader);
    this.socketGateway.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
    return updatedMaintenance;
  }

  @Delete("maintenance/:id")
  @Roles(["modifyMaintenance"])
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Delete a maintenance record' })
  @ApiParam({ name: 'id', type: 'string', description: 'Maintenance ID' })
  @ApiResponse({ status: 200, description: 'Maintenance record deleted.' })
  async deleteMaintenance(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    const deletedMaintenance = await this.maintenanceService.deleteMaintenance(id, authHeader);
    this.socketGateway.emitMaintenanceUpdate(await this.maintenanceService.getCurrentMaintenance());
    return deletedMaintenance;
  }

  @Get("admins")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all admins' })
  @ApiResponse({ status: 200, description: 'List of admins', type: UserListItemDto, isArray: true,})
  async getAdmins(@Headers('authorization') authHeader: string) {
    const data = await this.adminService.getAllAdmins(authHeader);
    return data;
  }

  @Roles(["modifyAdmins"])
  @UseGuards(RolesGuard)
  @Patch("admin/:id")
  @ApiOperation({ summary: 'Update admin rights' })
  @ApiParam({ name: 'id', type: 'string', description: 'Admin ID' })
  @ApiBody({ type: UpdateAdminRightsDto })
  @ApiResponse({ status: 200, description: 'Admin rights updated.' })
  async updateAdmin(@Headers('authorization') authHeader: string, @Param('id') id: string, @Body() body: UpdateAdminRightsDto) {
    return this.adminService.updateAdmin(+id, authHeader, body);
  }

  @Get("users")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: UserListItemDto, isArray: true,})
  async getUsers(@Headers('authorization') authHeader: string) {
    const data = await this.adminService.getAllUsers(authHeader);
    return data;
  }

  @Get("user/:id")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get user details' })
  @ApiParam({ name: 'id', type: 'string', description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Details of the user', type: UserStatsResponseDto, })
  
  async getUser(@Headers('authorization') authHeader: string, @Param('id') id: string) {
    const data = await this.adminService.getUser(+id, authHeader);
    return data;
  }

  @Get("statistics")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get statistics' })
  @ApiResponse({ status: 200, description: 'Rendszer statisztikák', type: SystemStatsResponseDto,})
  async getStatistics(@Headers('authorization') authHeader: string) {
    const data = await this.statisticsService.getStatistics(authHeader);
    console.log("Stat: ", data, " stat")
    return data;
  }

  @Get("cli")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Get CLI commands' })
  @ApiResponse({ status: 200, description: 'Returns CLI commands.' })
  async getCommands(@Headers('authorization') authHeader: string) {
    return this.cliService.getCommands(authHeader);
  }

  @Post("cli")
  @UseGuards(AdminGuard)
  @ApiOperation({ summary: 'Execute CLI command' })
  @ApiBody({ schema: { properties: { command: { type: 'string' } } } })
  @ApiResponse({ status: 200, description: 'Command executed successfully.' })
  async executeCommand(@Headers('authorization') authHeader: string, @Body() body: { command: string }) {
    return this.cliService.executeCommand(authHeader, body.command);
  }
}
