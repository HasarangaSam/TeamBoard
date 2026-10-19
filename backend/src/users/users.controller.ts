import { Controller, Get, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator.js';
import { AccountGuard } from '../auth/guards/account.guard.js';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard.js';
import { UserSyncGuard } from '../auth/guards/user-sync.guard.js';
import type { User } from '../generated/prisma/client.js';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@UseGuards(ClerkAuthGuard, UserSyncGuard, AccountGuard)
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  @Get('me')
  getCurrentUser(@CurrentUser() user: User) {
    return {
      id: user.id,
      clerkId: user.clerkId,
      email: user.email,
      name: user.name,
      role: user.role,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };
  }
}
