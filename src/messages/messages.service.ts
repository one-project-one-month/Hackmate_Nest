import { Injectable, NotFoundException } from '@nestjs/common';

import { MessageRepository } from './infrastructure/persistence/message.repository';
import { GetGroupMessagesQueryDto } from './dto/get-group-messages-query.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { ChatGroupMemberRepository } from '../chat-group-members/infrastructure/persistence/chat-group-member.repository';
import { MarkMessageAsReadDto } from './dto/mark-message-as-read.dto';
import { MarkMessageAsReadResponseDto } from './dto/mark-message-as-read-response.dto';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly chatGroupMemberRepository: ChatGroupMemberRepository,
  ) {}

  async findByGroupId(
    groupId: number,
    query: GetGroupMessagesQueryDto,
  ): Promise<MessageResponseDto[]> {
    const limit = query.limit ?? 20;
    const offset = query.offset ?? 0;

    const messages = await this.messageRepository.findByGroupId(groupId, {
      limit,
      offset,
    });

    return messages.map((message) => {
      const responseDto = new MessageResponseDto();
      responseDto.id = message.id;
      responseDto.groupId = message.group.id;
      responseDto.senderUserId = message.senderUserId;
      responseDto.body = message.body;
      responseDto.messageType = message.messageType;
      responseDto.metadata = message.metadata;
      responseDto.editedAt = message.editedAt;
      responseDto.deletedAt = message.deletedAt;
      responseDto.createdAt = message.createdAt;
      return responseDto;
    });
  }

  async markAsRead(
    messageId: number,
    body: MarkMessageAsReadDto,
  ): Promise<MarkMessageAsReadResponseDto> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    const member =
      await this.chatGroupMemberRepository.markAsReadByGroupAndUser(
        Number(message.group.id),
        body.userId,
        messageId,
      );

    if (!member) {
      throw new NotFoundException('Chat group member not found');
    }

    const responseDto = new MarkMessageAsReadResponseDto();
    responseDto.id = member.id;
    responseDto.groupId = member.group.id;
    responseDto.userId = member.userId;
    responseDto.lastReadMessageId = member.lastReadMessageId;
    responseDto.status = member.status;

    return responseDto;
  }
}
