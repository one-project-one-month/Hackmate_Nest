import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MessagesService } from './messages.service';
import { GetGroupMessagesQueryDto } from './dto/get-group-messages-query.dto';
import { MessageResponseDto } from './dto/message-response.dto';
import type { RequestWithUser } from '../middleware/guards/abstract-auth.guard';

@ApiTags('Messages')
@Controller({
  path: '/groups/:id/messages',
  version: '1',
})
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOkResponse({
    type: MessageResponseDto,
    isArray: true,
  })
  @Get()
  findByGroupId(
    @Req() req: RequestWithUser,
    @Param('id', ParseIntPipe) id: number,
    @Query() query: GetGroupMessagesQueryDto,
  ): Promise<MessageResponseDto[]> {
    if (!req.authUserId) {
      throw new UnauthorizedException('Missing authenticated user');
    }
    return this.messagesService.findByGroupId(id, query, req.authUserId);
  }
}
