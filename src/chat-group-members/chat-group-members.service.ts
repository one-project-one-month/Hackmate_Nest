import { Injectable } from '@nestjs/common';
import { ChatGroupMemberRepository } from './infrastructure/persistence/chat-group-member.repository';
import { ChatGroupMember } from './domain/chat-group-member';
import { AddUserIntoGroupDto } from './dto/add-user-into-group.dto';
import { ChatGroupMemberResponseDto } from './dto/chat-group-member-response.dto';
import { ChatGroupRepository } from '../chat-groups/infrastructure/persistence/chat-group.repository';
import { ChatGroup } from '../chat-groups/domain/chat-group';

@Injectable()
export class ChatGroupMembersService {
    constructor(
        private readonly chatGroupMemberRepository: ChatGroupMemberRepository,
    ) { }

    async addMember(addUserIntoGroupDto: AddUserIntoGroupDto): Promise<ChatGroupMemberResponseDto> {
        const group = new ChatGroup();
        group.id = addUserIntoGroupDto.groupId;

        const member = await this.chatGroupMemberRepository.create({
            group: group,
            userId: addUserIntoGroupDto.userId,
            role: addUserIntoGroupDto.role ?? 'member',
            lastReadMessageId: addUserIntoGroupDto.lastReadMessageId ?? null,
            mutedUntil: addUserIntoGroupDto.mutedUntil ? new Date(addUserIntoGroupDto.mutedUntil) : null,
            status: addUserIntoGroupDto.status ?? 'active',
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
}
