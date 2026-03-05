import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

type RequestWithUser = {
  headers: Record<string, string | string[] | undefined>;
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
  authUserId?: number;
};

@Injectable()
export class AuthMeGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader || Array.isArray(authorizationHeader)) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const authMeUrl =
      process.env.AUTH_ME_URL ||
      `${process.env.BACKEND_DOMAIN ?? 'http://localhost:8000'}/api/auth/me`;

    const response = await fetch(authMeUrl, {
      method: 'GET',
      headers: {
        Authorization: authorizationHeader,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload = (await response.json()) as Record<string, unknown>;
    const authUserId = this.extractAuthUserId(payload);

    if (authUserId === null) {
      throw new UnauthorizedException('Invalid auth/me response');
    }

    const requestedUserId = this.extractRequestedUserId(request);
    if (requestedUserId === -1) {
      throw new BadRequestException('Invalid userId');
    }

    if (requestedUserId !== null && authUserId !== requestedUserId) {
      throw new ForbiddenException(
        'Token user does not match requested userId',
      );
    }

    request.authUserId = authUserId;
    return true;
  }

  private extractRequestedUserId(request: RequestWithUser): number | null {
    const value =
      request.params?.userId ??
      request.body?.userId ??
      request.body?.createdByUserId ??
      request.query?.userId;

    if (value === undefined || value === null || value === '') {
      return null;
    }

    const parsed = this.parseNumber(value);
    return parsed === null ? -1 : parsed;
  }

  private extractAuthUserId(payload: Record<string, unknown>): number | null {
    const directId = this.parseNumber(payload.id);
    if (directId !== null) {
      return directId;
    }

    const user = payload.user as Record<string, unknown> | undefined;
    const userId = user ? this.parseNumber(user.id ?? user.userId) : null;
    if (userId !== null) {
      return userId;
    }

    const data = payload.data as Record<string, unknown> | undefined;
    const dataId = data ? this.parseNumber(data.id ?? data.userId) : null;
    return dataId;
  }

  private parseNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isInteger(value)) {
      return value;
    }

    if (typeof value === 'string' && value.trim() !== '') {
      const parsed = Number(value);
      if (Number.isInteger(parsed)) {
        return parsed;
      }
    }

    return null;
  }
}
