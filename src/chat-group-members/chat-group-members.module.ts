import { Module } from '@nestjs/common';
import { ChatGroupMembersController } from './chat-group-members.controller';
import { ChatGroupMembersService } from './chat-group-members.service';
import { RelationalPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';
import { ChatGroupsModule } from '../chat-groups/chat-groups.module';

@Module({
    imports: [RelationalPersistenceModule, ChatGroupsModule],
    controllers: [ChatGroupMembersController],
    providers: [ChatGroupMembersService],
})
export class ChatGroupMembersModule { }
