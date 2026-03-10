import { Injectable } from '@nestjs/common';
import { AbstractAuthGuard, RequestWithUser } from './abstract-auth.guard';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthMeGuard extends AbstractAuthGuard {
  getContextUserToken(context: ExecutionContext): string | undefined {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = req.headers.authorization;
    if (!authHeader) return undefined;
    return Array.isArray(authHeader) ? authHeader[0] : authHeader;
  }

  attachUser(context: ExecutionContext, authUserId: number): void {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    req.authUserId = authUserId;
  }
}
