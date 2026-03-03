import { Message } from '../../domain/message';

export abstract class MessageRepository {
  abstract findByGroupId(
    groupId: number,
    options: { limit: number; offset: number },
  ): Promise<Message[]>;

  abstract findById(id: number): Promise<Message | null>;

  abstract create(data: Omit<Message, 'id' | 'createdAt'>): Promise<Message>;
}
