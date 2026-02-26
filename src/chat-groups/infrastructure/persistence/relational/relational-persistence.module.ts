import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ChatGroupRepository } from '../chat-group.repository';
import { ChatGroupsRelationalRepository } from './repositories/chat-groups.repository';
import { ChatGroupEntity } from './entities/chat-group.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ChatGroupEntity])],
    providers: [
        {
            provide: ChatGroupRepository,
            useClass: ChatGroupsRelationalRepository,
        },
    ],
    exports: [ChatGroupRepository],
})
export class RelationalChatGroupPersistenceModule { }
