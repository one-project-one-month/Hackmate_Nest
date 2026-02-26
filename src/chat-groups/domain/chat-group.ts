import { ApiProperty } from '@nestjs/swagger';

export class ChatGroup {
    @ApiProperty({
        type: Number,
    })
    id: number | string;

    @ApiProperty({
        type: String,
        example: 'Blood Donation System',
    })
    name: string;

    @ApiProperty({
        type: String,
        example: 'A group to build Blood Donation System',
    })
    description: string | null;

    @ApiProperty({
        type: Number,
    })
    createdByUserId: number | string;

    @ApiProperty({
        type: Boolean,
        example: false,
    })
    isPrivate: boolean;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}
