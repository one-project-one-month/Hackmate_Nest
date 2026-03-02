import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MessageEntity } from '../entities/message.entity';
import { MessageRepository } from '../../message.repository';
import { Message } from '../../../../domain/message';
import { MessageMapper } from '../mappers/message.mapper';

@Injectable()
export class MessagesRelationalRepository implements MessageRepository {
  constructor(
    @InjectRepository(MessageEntity)
    private readonly messagesRepository: Repository<MessageEntity>,
  ) {}

  async findByGroupId(
    groupId: number,
    options: { limit: number; offset: number },
  ): Promise<Message[]> {
    const entities = await this.messagesRepository.find({
      where: {
        group: {
          id: groupId,
        },
      },
      order: {
        createdAt: 'DESC',
      },
      take: options.limit,
      skip: options.offset,
    });

    return entities.map((entity) => MessageMapper.toDomain(entity));
  }

  async findById(id: number): Promise<Message | null> {
    const entity = await this.messagesRepository.findOne({
      where: {
        id,
      },
    });

    if (!entity) {
      return null;
    }

    return MessageMapper.toDomain(entity);
  }
}
