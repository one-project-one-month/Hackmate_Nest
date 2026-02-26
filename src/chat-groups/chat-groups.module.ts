import { Module } from '@nestjs/common';

import { ChatGroupsController } from './chat-groups.controller';
import { ChatGroupsService } from './chat-groups.service';
import { RelationalChatGroupPersistenceModule } from './infrastructure/persistence/relational/relational-persistence.module';

@Module({
    imports: [RelationalChatGroupPersistenceModule],
    controllers: [ChatGroupsController],
    providers: [ChatGroupsService],
    exports: [ChatGroupsService],
})
export class ChatGroupsModule { }
