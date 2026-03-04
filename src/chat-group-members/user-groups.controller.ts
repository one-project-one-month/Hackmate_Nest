import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ChatGroupMembersService } from './chat-group-members.service';
import { UserGroupsResponseDto } from './dto/user-groups-response.dto';

@ApiTags('Chat Group Members')
@Controller({
  path: '/:userId/groups',
  version: '1',
})
export class UserGroupsController {
  constructor(
    private readonly chatGroupMembersService: ChatGroupMembersService,
  ) {}

  @ApiOkResponse({
    type: UserGroupsResponseDto,
  })
  @Get()
  findUserGroups(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserGroupsResponseDto> {
    return this.chatGroupMembersService.findUserGroups(userId);
  }
}
