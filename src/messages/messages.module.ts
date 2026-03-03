import { Module } from '@nestjs/common';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { RelationalPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalPersistenceModule as ChatGroupMembersRelationalPersistenceModule } from '../chat-group-members/infrastructure/persistence/relational/relational-persistence.module';
import { MessageReadController } from './message-read.controller';
import { MessagesGateway } from './messages.gateway';

@Module({
  imports: [
    RelationalPersistenceModule,
    ChatGroupMembersRelationalPersistenceModule,
  ],
  controllers: [MessagesController, MessageReadController],
  providers: [MessagesService, MessagesGateway],
})
export class MessagesModule {}
