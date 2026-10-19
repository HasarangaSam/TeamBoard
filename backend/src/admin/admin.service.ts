import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview() {
    const [totalUsers, activeUsers, totalTasks, completedTasks] =
      await this.prisma.$transaction([
        this.prisma.user.count(),
        this.prisma.user.count({
          where: { isActive: true },
        }),
        this.prisma.task.count(),
        this.prisma.task.count({
          where: { status: 'COMPLETED' },
        }),
      ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
      },
      tasks: {
        total: totalTasks,
        completed: completedTasks,
      },
    };
  }
}
