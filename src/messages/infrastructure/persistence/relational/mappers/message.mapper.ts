import { Message } from '../../../../domain/message';
import { MessageEntity } from '../entities/message.entity';
import { ChatGroupMapper } from '../../../../../chat-groups/infrastructure/persistence/relational/mappers/chat-group.mapper';

export class MessageMapper {
  static toDomain(raw: MessageEntity): Message {
    const domainEntity = new Message();
    domainEntity.id = raw.id;
    domainEntity.group = ChatGroupMapper.toDomain(raw.group);
    domainEntity.senderUserId = Number(raw.senderUserId);
    domainEntity.body = raw.body;
    domainEntity.messageType = raw.messageType;
    domainEntity.metadata = raw.metadata;
    domainEntity.editedAt = raw.editedAt;
    domainEntity.deletedAt = raw.deletedAt;
    domainEntity.createdAt = raw.createdAt;
    return domainEntity;
  }

  static toPersistence(domainEntity: Message): MessageEntity {
    const persistenceEntity = new MessageEntity();
    if (domainEntity.id && typeof domainEntity.id === 'number') {
      persistenceEntity.id = domainEntity.id;
    }
    persistenceEntity.group = ChatGroupMapper.toPersistence(domainEntity.group);
    persistenceEntity.senderUserId = Number(domainEntity.senderUserId);
    persistenceEntity.body = domainEntity.body;
    persistenceEntity.messageType = domainEntity.messageType;
    persistenceEntity.metadata = domainEntity.metadata;
    persistenceEntity.editedAt = domainEntity.editedAt;
    persistenceEntity.deletedAt = domainEntity.deletedAt;
    persistenceEntity.createdAt = domainEntity.createdAt;
    return persistenceEntity;
  }
}
