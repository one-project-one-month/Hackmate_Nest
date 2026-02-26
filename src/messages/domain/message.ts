import { ApiProperty } from '@nestjs/swagger';
import { ChatGroup } from '../../chat-groups/domain/chat-group';

export class Message {
    @ApiProperty({
        type: Number,
    })
    id: number | string;

    @ApiProperty({
        type: () => ChatGroup,
    })
    group: ChatGroup;

    @ApiProperty({
        type: Number,
    })
    senderUserId: number | string;

    @ApiProperty({
        type: String,
        example: 'Hello world!',
    })
    body: string;

    @ApiProperty({
        type: String,
        example: 'text',
    })
    messageType: string;

    @ApiProperty({
        type: Object,
        nullable: true,
    })
    metadata: Record<string, any> | null;

    @ApiProperty({
        nullable: true,
    })
    editedAt: Date | null;

    @ApiProperty({
        nullable: true,
    })
    deletedAt: Date | null;

    @ApiProperty()
    createdAt: Date;
}
