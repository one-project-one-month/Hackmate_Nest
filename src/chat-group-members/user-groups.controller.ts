import {
  Controller,
  Get,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ChatGroupMembersService } from './chat-group-members.service';
import { UserGroupsResponseDto } from './dto/user-groups-response.dto';
import type { RequestWithUser } from '../middleware/guards/abstract-auth.guard';

@ApiTags('Chat Group Members')
@Controller({
  path: '/my-groups',
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
    @Req() req: RequestWithUser,
  ): Promise<UserGroupsResponseDto> {
    if (!req.authUserId) {
      throw new UnauthorizedException('Missing authenticated user');
    }
    return this.chatGroupMembersService.findUserGroups(
      req.authUserId,
      req.authUserId,
    );
  }
}
