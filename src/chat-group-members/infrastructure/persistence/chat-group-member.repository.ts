import { ChatGroupMember } from '../../domain/chat-group-member';

export abstract class ChatGroupMemberRepository {
    abstract create(
        data: Omit<ChatGroupMember, 'id' | 'joinedAt'>,
    ): Promise<ChatGroupMember>;
}
