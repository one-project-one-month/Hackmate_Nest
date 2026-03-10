import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ChatGroupMembersService } from './chat-group-members.service';
import { UserGroupsResponseDto } from './dto/user-groups-response.dto';
import type { RequestWithUser } from '../middleware/guards/abstract-auth.guard';

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
    @Req() req: RequestWithUser,
  ): Promise<UserGroupsResponseDto> {
    if (!req.authUserId) {
      throw new UnauthorizedException('Missing authenticated user');
    }
    return this.chatGroupMembersService.findUserGroups(userId, req.authUserId);
  }
}
