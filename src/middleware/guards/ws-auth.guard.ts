import { Injectable } from '@nestjs/common';
import { AbstractAuthGuard } from './abstract-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard extends AbstractAuthGuard {
  getContextUserToken(context: ExecutionContext): string | undefined {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const auth = client.handshake.auth as Record<string, unknown> | undefined;
    if (auth && typeof auth.token === 'string') return auth.token;

    const headers = client.handshake.headers as
      | Record<string, unknown>
      | undefined;
    const authHeader = headers ? headers['authorization'] : undefined;
    if (typeof authHeader === 'string') {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) return token;
      return authHeader;
    }
    if (Array.isArray(authHeader) && typeof authHeader[0] === 'string') {
      const [type, token] = authHeader[0].split(' ');
      if (type === 'Bearer' && token) return token;
      return authHeader[0];
    }

    const queryToken = client.handshake.query.token;
    if (typeof queryToken === 'string') return queryToken;

    return undefined;
  }

  attachUser(context: ExecutionContext, authUserId: number): void {
    const client: Socket = context.switchToWs().getClient<Socket>();
    const data = client.data as Record<string, unknown>;
    data.user = { id: authUserId };
  }
}
