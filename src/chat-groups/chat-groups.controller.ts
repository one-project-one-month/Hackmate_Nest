import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  ForbiddenException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { ChatGroupsService } from './chat-groups.service';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { ChatGroup } from './domain/chat-group';
import type { RequestWithUser } from '../middleware/guards/abstract-auth.guard';

@ApiTags('Chat Groups')
@Controller({
  path: '/groups/create_group_with_project_id',
  version: '1',
})
export class ChatGroupsController {
  constructor(private readonly chatGroupsService: ChatGroupsService) {}

  @ApiCreatedResponse({
    type: ChatGroup,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Req() req: RequestWithUser,
    @Body() createChatGroupDto: CreateChatGroupDto,
  ): Promise<ChatGroup> {
    if (!req.authUserId) {
      throw new UnauthorizedException('Missing authenticated user');
    }
    if (
      createChatGroupDto.createdByUserId &&
      createChatGroupDto.createdByUserId !== req.authUserId
    ) {
      throw new ForbiddenException('Cannot create group for another user');
    }
    return this.chatGroupsService.create(createChatGroupDto, req.authUserId);
  }
}
