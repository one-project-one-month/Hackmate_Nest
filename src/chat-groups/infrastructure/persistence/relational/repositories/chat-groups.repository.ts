import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ChatGroupEntity } from '../entities/chat-group.entity';
import { ChatGroup } from '../../../../domain/chat-group';
import { ChatGroupRepository } from '../../chat-group.repository';
import { ChatGroupMapper } from '../mappers/chat-group.mapper';

@Injectable()
export class ChatGroupsRelationalRepository implements ChatGroupRepository {
    constructor(
        @InjectRepository(ChatGroupEntity)
        private readonly chatGroupsRepository: Repository<ChatGroupEntity>,
    ) { }

    async create(
        data: Omit<ChatGroup, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<ChatGroup> {
        const persistenceModel = ChatGroupMapper.toPersistence(data as ChatGroup);
        const newEntity = await this.chatGroupsRepository.save(
            this.chatGroupsRepository.create(persistenceModel),
        );
        return ChatGroupMapper.toDomain(newEntity);
    }
}
