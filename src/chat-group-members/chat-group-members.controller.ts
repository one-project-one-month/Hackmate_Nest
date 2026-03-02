import { Controller, Post, Body, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { ChatGroupMembersService } from './chat-group-members.service';
import { AddUserIntoGroupDto } from './dto/add-user-into-group.dto';
import { ChatGroupMemberResponseDto } from './dto/chat-group-member-response.dto';

@ApiTags('Chat Group Members')
@Controller({
  path: '/groups/add_user_into_group',
  version: '1',
})
export class ChatGroupMembersController {
  constructor(
    private readonly chatGroupMembersService: ChatGroupMembersService,
  ) {}

  @ApiCreatedResponse({
    type: ChatGroupMemberResponseDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  addMember(
    @Body() addUserIntoGroupDto: AddUserIntoGroupDto,
  ): Promise<ChatGroupMemberResponseDto> {
    return this.chatGroupMembersService.addMember(addUserIntoGroupDto);
  }
}
