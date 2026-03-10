import { Module } from '@nestjs/common';

import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { RelationalPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { RelationalPersistenceModule as ChatGroupMembersRelationalPersistenceModule } from '../chat-group-members/infrastructure/persistence/relational/relational-persistence.module';
import { RelationalChatGroupPersistenceModule } from '../chat-groups/infrastructure/persistence/relational/relational-persistence.module';
import { MessageReadController } from './message-read.controller';
import { MessagesGateway } from './messages.gateway';
import { WsAuthGuard } from '../middleware/guards/ws-auth.guard';

@Module({
  imports: [
    RelationalPersistenceModule,
    ChatGroupMembersRelationalPersistenceModule,
    RelationalChatGroupPersistenceModule,
  ],
  controllers: [MessagesController, MessageReadController],
  providers: [MessagesService, MessagesGateway, WsAuthGuard],
})
export class MessagesModule {}
