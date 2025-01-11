import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { CreateMaintenanceDto } from './dto/create-maintenance.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { getCurrentDate } from 'src/shared/utilities/CurrentDate';

@Injectable()
export class AdminService {
  constructor(
    private prisma: PrismaService,
    @Inject(forwardRef(() => SocketGateway)) private socketGateway: SocketGateway
  ) { }

  create(createAdminDto: CreateAdminDto) {
    return 'This action adds a new admin';
  }

  findAll() {
    return `This action returns all admin`;
  }

  findOne(id: number) {
    return `This action returns a #${id} admin`;
  }

  update(id: number, updateAdminDto: UpdateAdminDto) {
    return `This action updates a #${id} admin`;
  }

  remove(id: number) {
    return `This action removes a #${id} admin`;
  }

  async createMaintenance(createMaintenanceDto: CreateMaintenanceDto) {
    const newMaintenance = await this.prisma.maintenance.create({
      data: {
        user: 1,
        ...createMaintenanceDto
      }
    })

    this.socketGateway.emitMaintenanceUpdate(await this.getCurrentMaintenance());

    return newMaintenance
  }

  async getUpcomingMaintenance() {
    return this.prisma.maintenance.findFirst({
      where: {
        end: { gte: getCurrentDate() },
      },
      orderBy: { start: 'asc' },
    });
  }

  async getCurrentMaintenance() {
    const upcomingMaintenance = await this.getUpcomingMaintenance();
    if (!upcomingMaintenance) {
      return {
        started: false,
        countdown: null
      }
    }

    const now = getCurrentDate()

    const started = upcomingMaintenance.start < now

    const countdown = Math.round((started ? (
      upcomingMaintenance.end.getTime() - now.getTime()
    ) : (
      upcomingMaintenance.start.getTime() - now.getTime()
    )) / 1000)

    return {
      started: started,
      countdown: countdown > 0 ? countdown : null
    }
  }
}
