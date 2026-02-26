import { Injectable } from '@nestjs/common';
import { ChatGroupRepository } from './infrastructure/persistence/chat-group.repository';
import { ChatGroup } from './domain/chat-group';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';

@Injectable()
export class ChatGroupsService {
    constructor(private readonly chatGroupRepository: ChatGroupRepository) { }

    async create(createChatGroupDto: CreateChatGroupDto): Promise<ChatGroup> {
        return this.chatGroupRepository.create({
            name: createChatGroupDto.name,
            description: createChatGroupDto.description ?? null,
            createdByUserId: createChatGroupDto.createdByUserId,
            isPrivate: createChatGroupDto.isPrivate ?? false,
        });
    }
}
