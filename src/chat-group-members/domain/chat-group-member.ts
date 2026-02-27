import { ApiProperty } from '@nestjs/swagger';
import { ChatGroup } from '../../chat-groups/domain/chat-group';
const idType = Number;
export class ChatGroupMember {
    @ApiProperty({
        type: idType,
    })
    id: number | string;

    @ApiProperty({
        type: () => ChatGroup,
    })
    group: ChatGroup;

    @ApiProperty({
        type: Number,
    })
    userId: number | string;

    @ApiProperty({
        type: String,
        example: 'member',
    })
    role: string | null;

    @ApiProperty()
    joinedAt: Date;

    @ApiProperty({
        type: Number,
        nullable: true,
    })
    lastReadMessageId: number | string | null;

    @ApiProperty({
        nullable: true,
    })
    mutedUntil: Date | null;

    @ApiProperty({
        type: String,
        example: 'active',
    })
    status: string | null;
}
