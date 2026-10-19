import { Module } from '@nestjs/common';

import { PrismaModule } from '../prisma/prisma.module.js';
import { AuthModule } from '../auth/auth.module.js';
import { AdminController } from './admin.controller.js';
import { AdminService } from './admin.service.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [AdminController],
  providers: [AdminService, RolesGuard],
})
export class AdminModule {}
