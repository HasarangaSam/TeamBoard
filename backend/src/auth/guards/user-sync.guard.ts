import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClerkClient } from '@clerk/backend';
import { PrismaService } from '../../prisma/prisma.service.js';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.js';

@Injectable()
export class UserSyncGuard implements CanActivate {
  private readonly clerkClient: ReturnType<typeof createClerkClient>;

  constructor(
    private readonly prisma: PrismaService,
    config: ConfigService,
  ) {
    this.clerkClient = createClerkClient({
      secretKey: config.getOrThrow<string>('CLERK_SECRET_KEY'),
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const clerkId = request.clerkUserId;

    if (!clerkId) {
      throw new UnauthorizedException('Authentication is required.');
    }

    let user = await this.prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      try {
        const clerkUser = await this.clerkClient.users.getUser(clerkId);

        const primaryEmail = clerkUser.emailAddresses.find(
          (email) => email.id === clerkUser.primaryEmailAddressId,
        )?.emailAddress;

        const email = primaryEmail ?? clerkUser.emailAddresses[0]?.emailAddress;

        if (!email) {
          throw new UnauthorizedException(
            'Your Clerk account must have an email address.',
          );
        }

        const name =
          [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
          null;

        user = await this.prisma.user.create({
          data: {
            clerkId,
            email,
            name,
          },
        });
      } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw error;
        }

        // A temporary Clerk API failure should not create a fake user.
        throw new ServiceUnavailableException(
          'Unable to load your account. Please try again.',
        );
      }
    }

    request.user = user;
    return true;
  }
}
