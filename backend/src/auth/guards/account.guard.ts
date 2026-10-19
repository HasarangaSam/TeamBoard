import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { AuthenticatedRequest } from '../../common/types/authenticated-request.js';

@Injectable()
export class AccountGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    if (!request.user) {
      throw new UnauthorizedException('Authentication is required.');
    }

    if (!request.user.isActive) {
      throw new ForbiddenException('Your account is inactive.');
    }

    return true;
  }
}
