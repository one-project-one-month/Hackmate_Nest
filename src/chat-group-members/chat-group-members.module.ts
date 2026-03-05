import { Module } from '@nestjs/common';
import { ChatGroupMembersController } from './chat-group-members.controller';
import { ChatGroupMembersService } from './chat-group-members.service';
import { RelationalPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ChatGroupsModule } from '../chat-groups/chat-groups.module';
import { RelationalPersistenceModule as MessageRelationalPersistenceModule } from '../messages/infrastructure/persistence/relational/relational-persistence.module';
import { UserGroupsController } from './user-groups.controller';

@Module({
  imports: [
    RelationalPersistenceModule,
    ChatGroupsModule,
    MessageRelationalPersistenceModule,
  ],
  controllers: [ChatGroupMembersController, UserGroupsController],
  providers: [ChatGroupMembersService],
})
export class ChatGroupMembersModule {}
