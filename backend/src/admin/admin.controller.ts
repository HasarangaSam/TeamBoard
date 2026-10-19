import { Controller, Get, UseGuards } from '@nestjs/common';

import { AdminService } from './admin.service.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { UserSyncGuard } from '../auth/guards/user-sync.guard.js';
import { AccountGuard } from '../auth/guards/account.guard.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('admin')
@UseGuards(ClerkAuthGuard, UserSyncGuard, AccountGuard, RolesGuard)
@ApiTags('Admin')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('overview')
  @Roles('ADMIN')
  getOverview() {
    return this.adminService.getOverview();
  }
}
