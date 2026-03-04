import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WsException,
} from '@nestjs/websockets';
import { ValidationPipe, UsePipes, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';

import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import validationOptions from '../utils/validation-options';

const GROUP_NAMESPACE_REGEX = /^\/v1\/ws\/(\d+)$/;

@WebSocketGateway({
  namespace: GROUP_NAMESPACE_REGEX,
  cors: { origin: '*' },
})
export class MessagesGateway {
  private readonly logger = new Logger(MessagesGateway.name);

  constructor(private readonly messagesService: MessagesService) {}

  handleConnection(client: Socket): void {
    const groupId = this.extractGroupId(client);
    if (!groupId) {
      this.logger.error(
        `Connection rejected: invalid namespace for client ${client.id}`,
      );
      client.disconnect();
      return;
    }
    this.logger.log(`Client ${client.id} connected to group ${groupId}`);
  }

  /**
   * Receiving and broadcasting messages
   */
  @UsePipes(new ValidationPipe(validationOptions))
  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() body: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const groupId = this.extractGroupId(client);
    if (!groupId) {
      throw new WsException('Invalid group id');
    }

    try {
      const created = await this.messagesService.create(groupId, body);
      client.nsp.emit('message:new', created);
      return created;
    } catch (error) {
      this.logger.error(
        `Failed to create message in group ${groupId}: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
      throw new WsException('Failed to send message');
    }
  }

  private extractGroupId(client: Socket): number | null {
    const match = GROUP_NAMESPACE_REGEX.exec(client.nsp.name);
    if (!match) {
      return null;
    }

    const groupId = Number(match[1]);
    if (!Number.isInteger(groupId) || groupId <= 0) {
      return null;
    }

    return groupId;
  }
}
