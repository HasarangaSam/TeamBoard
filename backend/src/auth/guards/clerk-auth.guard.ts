import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { verifyToken } from '@clerk/backend';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.js';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    const authorization = request.headers.authorization;
    const [scheme, token] = authorization?.split(' ') ?? [];

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException('Authentication is required.');
    }

    try {
      const payload = await verifyToken(token, {
        secretKey: this.config.getOrThrow<string>('CLERK_SECRET_KEY'),
        authorizedParties: ['http://localhost:5173'],
      });

      if (!payload.sub) {
        throw new UnauthorizedException('Invalid authentication token.');
      }

      request.clerkUserId = payload.sub;
      return true;
    } catch {
      // Do not expose token verification details to the client.
      throw new UnauthorizedException('Invalid or expired session.');
    }
  }
}
