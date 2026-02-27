import { ChatGroup } from '../../domain/chat-group';

export abstract class ChatGroupRepository {
    abstract create(
        data: Omit<ChatGroup, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<ChatGroup>;
}
