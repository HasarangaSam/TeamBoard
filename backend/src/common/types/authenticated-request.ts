import type { Request } from 'express';
import { User } from '../../generated/prisma/client.js';

export interface AuthenticatedRequest extends Request {
  clerkUserId?: string;
  user?: User;
}
