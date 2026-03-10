import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Socket } from 'socket.io';

export type RequestWithUser = {
  headers: Record<string, string | string[] | undefined>;
  params?: Record<string, unknown>;
  body?: Record<string, unknown>;
  query?: Record<string, unknown>;
  authUserId?: number;
};

@Injectable()
export abstract class AbstractAuthGuard implements CanActivate {
  private readonly logger = new Logger(this.constructor.name);

  abstract getContextUserToken(context: ExecutionContext): string | undefined;
  abstract attachUser(context: ExecutionContext, authUserId: number): void;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const nodeEnv = process.env.NODE_ENV ?? 'development';
    const allowFakeAuth =
      process.env.ALLOW_FAKE_AUTH === 'true' || nodeEnv === 'test';
    if (allowFakeAuth && nodeEnv !== 'production') {
      const fakeUserId = this.getFakeUserId(context);
      if (fakeUserId !== null) {
        this.attachUser(context, fakeUserId);
        return true;
      }
    }

    const token = this.getContextUserToken(context);
    if (!token) {
      throw new UnauthorizedException('Missing authentication token');
    }

    try {
      const authUserId = await this.validateToken(token);
      this.attachUser(context, authUserId);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Token validation failed: ${message}`);
      throw new UnauthorizedException('Invalid token');
    }
  }

  private getFakeUserId(context: ExecutionContext): number | null {
    if (context.getType() === 'ws') {
      const client = context.switchToWs().getClient<Socket>();
      const val =
        client.handshake.headers['x-user-id'] ??
        client.handshake.query?.['x-user-id'];
      if (!val) return null;
      const parsed = parseInt(val as string, 10);
      return Number.isNaN(parsed) ? null : parsed;
    }

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const val = req.headers['x-user-id'];
    if (!val) return null;
    const parsed = parseInt(val as string, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }

  private async validateToken(token: string): Promise<number> {
    const authMeUrl =
      process.env.AUTH_ME_URL ??
      `${process.env.BACKEND_DOMAIN ?? 'http://localhost:8000'}/api/auth/me`;

    const authHeaderValue = token.startsWith('Bearer ')
      ? token
      : `Bearer ${token}`;

    const timeoutMs = Number.parseInt(
      process.env.AUTH_ME_TIMEOUT_MS ?? '2000',
      10,
    );
    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      Number.isNaN(timeoutMs) ? 2000 : timeoutMs,
    );

    try {
      const response = await fetch(authMeUrl, {
        method: 'GET',
        headers: { Authorization: authHeaderValue, Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Auth service returned ${response.status}`);
      }

      const payload = (await response.json()) as Record<string, unknown>;
      const authUserId = this.extractAuthUserId(payload);

      if (authUserId === null) throw new Error('Invalid auth/me response');
      return authUserId;
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('Auth service timeout');
      }
      throw err;
    } finally {
      clearTimeout(timeout);
    }
  }

  protected extractAuthUserId(payload: Record<string, unknown>): number | null {
    const directId = this.parseNumber(payload.id);
    if (directId !== null) return directId;

    const user = payload.user as Record<string, unknown> | undefined;
    const userId = user ? this.parseNumber(user.id ?? user.userId) : null;
    if (userId !== null) return userId;

    const data = payload.data as Record<string, unknown> | undefined;
    return data ? this.parseNumber(data.id ?? data.userId) : null;
  }

  protected parseNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isInteger(value)) return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value, 10);
      if (!Number.isNaN(parsed)) return parsed;
    }
    return null;
  }
}
