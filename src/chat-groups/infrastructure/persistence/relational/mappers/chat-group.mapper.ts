import { ChatGroup } from '../../../../domain/chat-group';
import { ChatGroupEntity } from '../entities/chat-group.entity';

export class ChatGroupMapper {
    static toDomain(raw: ChatGroupEntity): ChatGroup {
        const domainEntity = new ChatGroup();
        domainEntity.id = raw.id;
        domainEntity.name = raw.name;
        domainEntity.description = raw.description;
        domainEntity.createdByUserId = Number(raw.createdByUserId);
        domainEntity.isPrivate = raw.isPrivate;
        domainEntity.createdAt = raw.createdAt;
        domainEntity.updatedAt = raw.updatedAt;
        return domainEntity;
    }

    static toPersistence(domainEntity: ChatGroup): ChatGroupEntity {
        const persistenceEntity = new ChatGroupEntity();
        if (domainEntity.id && typeof domainEntity.id === 'number') {
            persistenceEntity.id = domainEntity.id;
        }
        persistenceEntity.name = domainEntity.name;
        persistenceEntity.description = domainEntity.description;
        persistenceEntity.createdByUserId = Number(domainEntity.createdByUserId);
        persistenceEntity.isPrivate = domainEntity.isPrivate;
        persistenceEntity.createdAt = domainEntity.createdAt;
        persistenceEntity.updatedAt = domainEntity.updatedAt;
        return persistenceEntity;
    }
}
