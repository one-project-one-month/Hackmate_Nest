import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { MessageRepository } from './infrastructure/persistence/message.repository';
import { GetGroupMessagesQueryDto } from './dto/get-group-messages-query.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import { ChatGroupMemberRepository } from '../chat-group-members/infrastructure/persistence/chat-group-member.repository';
import { ChatGroupRepository } from '../chat-groups/infrastructure/persistence/chat-group.repository';
import { MarkMessageAsReadResponseDto } from './dto/mark-message-as-read-response.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { ChatGroup } from '../chat-groups/domain/chat-group';

@Injectable()
export class MessagesService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly chatGroupMemberRepository: ChatGroupMemberRepository,
    private readonly chatGroupRepository: ChatGroupRepository,
  ) {}

  async findByGroupId(
    groupId: number,
    query: GetGroupMessagesQueryDto,
    requesterUserId: number,
  ): Promise<MessageResponseDto[]> {
    await this.assertMember(groupId, requesterUserId);

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
    userId: number,
  ): Promise<MarkMessageAsReadResponseDto> {
    const message = await this.messageRepository.findById(messageId);

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    await this.assertMember(Number(message.group.id), userId);

    const member =
      await this.chatGroupMemberRepository.markAsReadByGroupAndUser(
        Number(message.group.id),
        userId,
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

  async create(
    groupId: number,
    senderUserId: number,
    body: CreateMessageDto,
  ): Promise<MessageResponseDto> {
    const group = await this.chatGroupRepository.findById(groupId);
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    await this.assertMember(groupId, senderUserId);

    const groupRef = new ChatGroup();
    groupRef.id = groupId;

    const message = await this.messageRepository.create({
      group: groupRef,
      senderUserId,
      body: body.body,
      messageType: body.messageType ?? 'text',
      metadata: body.metadata ?? {},
      editedAt: null,
      deletedAt: null,
    });

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
  }

  async assertMember(groupId: number, userId: number): Promise<void> {
    const member = await this.chatGroupMemberRepository.findByGroupAndUser(
      groupId,
      userId,
    );

    if (!member) {
      throw new ForbiddenException('User is not a member of this group');
    }
  }
}
