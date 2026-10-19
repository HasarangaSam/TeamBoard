import { Module } from '@nestjs/common';
import { ClerkAuthGuard } from './guards/clerk-auth.guard.js';
import { UserSyncGuard } from './guards/user-sync.guard.js';
import { AccountGuard } from './guards/account.guard.js';

@Module({
  providers: [ClerkAuthGuard, UserSyncGuard, AccountGuard],
  exports: [ClerkAuthGuard, UserSyncGuard, AccountGuard],
})
export class AuthModule {}
