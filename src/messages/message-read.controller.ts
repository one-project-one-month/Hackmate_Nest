import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { MessagesService } from './messages.service';
import { MarkMessageAsReadDto } from './dto/mark-message-as-read.dto';
import { MarkMessageAsReadResponseDto } from './dto/mark-message-as-read-response.dto';

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
    @Body() body: MarkMessageAsReadDto,
  ): Promise<MarkMessageAsReadResponseDto> {
    return this.messagesService.markAsRead(messageId, body);
  }
}
