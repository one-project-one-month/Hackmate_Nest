import { ChatGroupMember } from '../../../../domain/chat-group-member';
import { ChatGroupMemberEntity } from '../entities/chat-group-member.entity';
import { ChatGroupMapper } from '../../../../../chat-groups/infrastructure/persistence/relational/mappers/chat-group.mapper';

export class ChatGroupMemberMapper {
  static toDomain(raw: ChatGroupMemberEntity): ChatGroupMember {
    const domainEntity = new ChatGroupMember();
    domainEntity.id = raw.id;
    domainEntity.group = ChatGroupMapper.toDomain(raw.group);
    domainEntity.userId = Number(raw.userId);
    domainEntity.role = raw.role;
    domainEntity.joinedAt = raw.joinedAt;
    domainEntity.lastReadMessageId = raw.lastReadMessageId
      ? Number(raw.lastReadMessageId)
      : null;
    domainEntity.mutedUntil = raw.mutedUntil;
    domainEntity.status = raw.status;
    return domainEntity;
  }

  static toPersistence(domainEntity: ChatGroupMember): ChatGroupMemberEntity {
    const persistenceEntity = new ChatGroupMemberEntity();
    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.group = ChatGroupMapper.toPersistence(domainEntity.group);
    persistenceEntity.userId = Number(domainEntity.userId);
    persistenceEntity.role = domainEntity.role;
    persistenceEntity.joinedAt = domainEntity.joinedAt;
    persistenceEntity.lastReadMessageId = domainEntity.lastReadMessageId
      ? Number(domainEntity.lastReadMessageId)
      : null;
    persistenceEntity.mutedUntil = domainEntity.mutedUntil;
    persistenceEntity.status = domainEntity.status;
    return persistenceEntity;
  }
}
