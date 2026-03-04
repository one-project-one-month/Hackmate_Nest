import { Injectable } from '@nestjs/common';
import { ChatGroupMemberRepository } from './infrastructure/persistence/chat-group-member.repository';
import { AddUserIntoGroupDto } from './dto/add-user-into-group.dto';
import { ChatGroupMemberResponseDto } from './dto/chat-group-member-response.dto';
import { ChatGroup } from '../chat-groups/domain/chat-group';
import { MessageRepository } from '../messages/infrastructure/persistence/message.repository';
import {
  LastMessageDto,
  UserGroupItemDto,
  UserGroupsResponseDto,
} from './dto/user-groups-response.dto';

@Injectable()
export class ChatGroupMembersService {
  constructor(
    private readonly chatGroupMemberRepository: ChatGroupMemberRepository,
    private readonly messageRepository: MessageRepository,
  ) {}

  async addMember(
    addUserIntoGroupDto: AddUserIntoGroupDto,
  ): Promise<ChatGroupMemberResponseDto> {
    const group = new ChatGroup();
    group.id = addUserIntoGroupDto.groupId;

    const member = await this.chatGroupMemberRepository.create({
      group: group,
      userId: addUserIntoGroupDto.userId,
      role: addUserIntoGroupDto.role ?? 'member',
      lastReadMessageId: addUserIntoGroupDto.lastReadMessageId ?? null,
      mutedUntil: addUserIntoGroupDto.mutedUntil
        ? new Date(addUserIntoGroupDto.mutedUntil)
        : null,
      status: 'unread',
    });

    const responseDto = new ChatGroupMemberResponseDto();
    responseDto.id = member.id;
    responseDto.groupId = member.group.id;
    responseDto.userId = member.userId;
    responseDto.role = member.role;
    responseDto.joinedAt = member.joinedAt;
    responseDto.lastReadMessageId = member.lastReadMessageId;
    responseDto.mutedUntil = member.mutedUntil;
    responseDto.status = member.status;

    return responseDto;
  }

  async findUserGroups(userId: number): Promise<UserGroupsResponseDto> {
    const members = await this.chatGroupMemberRepository.findByUserId(userId);

    const groups = await Promise.all(
      members.map(async (member) => {
        let lastreadMessage: LastMessageDto | null = null;
        const lastReadMessageId = member.lastReadMessageId
          ? Number(member.lastReadMessageId)
          : null;

        if (lastReadMessageId) {
          const lastReadMessageEntity =
            await this.messageRepository.findById(lastReadMessageId);

          if (
            lastReadMessageEntity &&
            Number(lastReadMessageEntity.group.id) === Number(member.group.id)
          ) {
            const dto = new LastMessageDto();
            dto.id = lastReadMessageEntity.id;
            dto.senderUserId = lastReadMessageEntity.senderUserId;
            dto.body = lastReadMessageEntity.body;
            dto.messageType = lastReadMessageEntity.messageType;
            dto.createdAt = lastReadMessageEntity.createdAt;
            lastreadMessage = dto;
          }
        }

        const itemDto = new UserGroupItemDto();
        itemDto.groupId = member.group.id;
        itemDto.groupName = member.group.name;
        itemDto.status = member.status ?? 'unread';
        itemDto.lastreadMessage = lastreadMessage;
        return itemDto;
      }),
    );

    const responseDto = new UserGroupsResponseDto();
    responseDto.userId = userId;
    responseDto.groups = groups;

    return responseDto;
  }
}
