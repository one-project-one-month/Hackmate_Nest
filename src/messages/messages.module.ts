import { Module } from '@nestjs/common';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { RelationalPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalPersistenceModule as ChatGroupMembersRelationalPersistenceModule } from '../chat-group-members/infrastructure/persistence/relational/relational-persistence.module';
import { MessageReadController } from './message-read.controller';

@Module({
  imports: [
    RelationalPersistenceModule,
    ChatGroupMembersRelationalPersistenceModule,
  ],
  controllers: [MessagesController, MessageReadController],
  providers: [MessagesService],
})
export class MessagesModule {}
