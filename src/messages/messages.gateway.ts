import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { ValidationPipe, UsePipes, Logger, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';

import { MessagesService } from './messages.service';
import { MessageResponseDto } from './dto/message-response.dto';
import validationOptions from '../utils/validation-options';
import { WsAuthGuard } from '../middleware/guards/ws-auth.guard';
import { JoinGroupDto } from './dto/join-group.dto';
import { SendMessageDto } from './dto/send-message.dto';

type MessagesServicePort = {
  assertMember(groupId: number, userId: number): Promise<void>;
  create(
    groupId: number,
    userId: number,
    body: SendMessageDto,
  ): Promise<MessageResponseDto>;
};

@WebSocketGateway({
  namespace: '/v1/ws',
  cors: {
    origin: process.env.WS_CORS_ORIGIN ?? process.env.FRONTEND_DOMAIN ?? '*',
  },
})
@UseGuards(WsAuthGuard)
export class MessagesGateway {
  private readonly logger = new Logger(MessagesGateway.name);
  private readonly messagesService: MessagesServicePort;

  constructor(messagesService: MessagesService) {
    this.messagesService = messagesService;
  }

  handleConnection(client: Socket): void {
    this.logger.log(`Client ${client.id} connected`);
  }

  @UsePipes(new ValidationPipe(validationOptions))
  @SubscribeMessage('group:join')
  async handleJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinGroupDto,
  ): Promise<{ groupId: number; status: 'joined' }> {
    const { groupId } = body;
    const userId = this.getUserId(client);
    if (!userId) {
      throw new WsException('Unauthorized');
    }

    await this.messagesService.assertMember(groupId, userId);
    await client.join(this.getGroupRoom(groupId));
    return { groupId, status: 'joined' };
  }

  @UsePipes(new ValidationPipe(validationOptions))
  @SubscribeMessage('group:leave')
  async handleLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: JoinGroupDto,
  ): Promise<{ groupId: number; status: 'left' }> {
    const { groupId } = body;
    await client.leave(this.getGroupRoom(groupId));
    return { groupId, status: 'left' };
  }

  @UsePipes(new ValidationPipe(validationOptions))
  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: SendMessageDto,
  ): Promise<MessageResponseDto> {
    const { groupId } = body;

    const userId = this.getUserId(client);
    if (!userId) {
      throw new WsException('Unauthorized');
    }

    try {
      await this.messagesService.assertMember(groupId, userId);
      await client.join(this.getGroupRoom(groupId));
      const created = await this.messagesService.create(groupId, userId, body);
      client.nsp
        .to(this.getGroupRoom(groupId))
        .emit(`group:${groupId}:message:new`, created);
      return created;
    } catch (error) {
      this.logger.error(
        `Failed to create message in group ${groupId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw new WsException(
        error instanceof Error ? error.message : 'Failed to send message',
      );
    }
  }

  private getGroupRoom(groupId: number): string {
    return `group:${groupId}`;
  }

  private getUserId(client: Socket): number | null {
    const data = client.data as unknown;
    if (!data || typeof data !== 'object') {
      return null;
    }

    const user = (data as Record<string, unknown>).user;
    if (!user || typeof user !== 'object') {
      return null;
    }

    const userId = (user as Record<string, unknown>).id;
    return typeof userId === 'number' ? userId : null;
  }
}
