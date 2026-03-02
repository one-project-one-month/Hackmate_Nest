import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatGroupMemberEntity } from './entities/chat-group-member.entity';
import { ChatGroupMemberRepository } from '../chat-group-member.repository';
import { ChatGroupMembersRelationalRepository } from './repositories/chat-group-members.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ChatGroupMemberEntity])],
  providers: [
    {
      provide: ChatGroupMemberRepository,
      useClass: ChatGroupMembersRelationalRepository,
    },
  ],
  exports: [ChatGroupMemberRepository],
})
export class RelationalPersistenceModule {}
