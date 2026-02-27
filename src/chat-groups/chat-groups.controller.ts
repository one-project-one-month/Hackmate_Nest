import {
    Controller,
    Post,
    Body,
    HttpStatus,
    HttpCode,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { ChatGroupsService } from './chat-groups.service';
import { CreateChatGroupDto } from './dto/create-chat-group.dto';
import { ChatGroup } from './domain/chat-group';

@ApiTags('Chat Groups')
@Controller({
    path: '/groups/create_group_with_project_id',
    version: '1',
})
export class ChatGroupsController {
    constructor(private readonly chatGroupsService: ChatGroupsService) { }

    @ApiCreatedResponse({
        type: ChatGroup,
    })
    @Post()
    @HttpCode(HttpStatus.CREATED)
    create(@Body() createChatGroupDto: CreateChatGroupDto): Promise<ChatGroup> {
        return this.chatGroupsService.create(createChatGroupDto);
    }
}
