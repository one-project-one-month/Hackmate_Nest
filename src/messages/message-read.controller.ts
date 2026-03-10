import {
  Body,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MessagesService } from './messages.service';
import { MarkMessageAsReadDto } from './dto/mark-message-as-read.dto';
import { MarkMessageAsReadResponseDto } from './dto/mark-message-as-read-response.dto';
import type { RequestWithUser } from '../middleware/guards/abstract-auth.guard';

@ApiTags('Messages')
@Controller({
  path: '/messages/:messageId/read',
  version: '1',
})
export class MessageReadController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiOkResponse({
    type: MarkMessageAsReadResponseDto,
  })
  @Post()
  @HttpCode(HttpStatus.OK)
  markAsRead(
    @Param('messageId', ParseIntPipe) messageId: number,
    @Req() req: RequestWithUser,
    @Body() body: MarkMessageAsReadDto,
  ): Promise<MarkMessageAsReadResponseDto> {
    if (!req.authUserId) {
      throw new UnauthorizedException('Missing authenticated user');
    }
    if (body.userId && body.userId !== req.authUserId) {
      throw new ForbiddenException('Cannot mark messages for another user');
    }
    return this.messagesService.markAsRead(messageId, req.authUserId);
  }
}
