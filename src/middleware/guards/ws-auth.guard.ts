import { Injectable } from '@nestjs/common';
import { AbstractAuthGuard } from './abstract-auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class WsAuthGuard extends AbstractAuthGuard {
  getContextUserToken(context: ExecutionContext): string | undefined {
    const client: Socket = context.switchToWs().getClient<Socket>();
    if (client.handshake.auth?.token) return client.handshake.auth.token;

    const authHeader = client.handshake.headers.authorization;
    if (authHeader) {
      const [type, token] = authHeader.split(' ');
      if (type === 'Bearer' && token) return token;
      return authHeader;
    }

    const queryToken = client.handshake.query.token;
    if (typeof queryToken === 'string') return queryToken;

    return undefined;
  }

  attachUser(context: ExecutionContext, authUserId: number): void {
    const client: Socket = context.switchToWs().getClient<Socket>();
    client.data.user = { id: authUserId };
  }
}
