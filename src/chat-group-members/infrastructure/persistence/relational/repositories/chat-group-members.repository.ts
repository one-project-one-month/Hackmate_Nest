import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatGroupMemberEntity } from '../entities/chat-group-member.entity';
import { ChatGroupMember } from '../../../../domain/chat-group-member';
import { ChatGroupMemberRepository } from '../../chat-group-member.repository';
import { ChatGroupMemberMapper } from '../mappers/chat-group-member.mapper';

@Injectable()
export class ChatGroupMembersRelationalRepository implements ChatGroupMemberRepository {
    constructor(
        @InjectRepository(ChatGroupMemberEntity)
        private readonly chatGroupMemberRepository: Repository<ChatGroupMemberEntity>,
    ) { }

    async create(
        data: Omit<ChatGroupMember, 'id' | 'joinedAt'>,
    ): Promise<ChatGroupMember> {
        const persistenceModel = ChatGroupMemberMapper.toPersistence(data as ChatGroupMember);
        const newEntity = await this.chatGroupMemberRepository.save(
            this.chatGroupMemberRepository.create(persistenceModel),
        );
        return ChatGroupMemberMapper.toDomain(newEntity);
    }
}
