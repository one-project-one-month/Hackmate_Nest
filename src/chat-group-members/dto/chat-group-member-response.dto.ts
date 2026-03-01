import { ApiProperty } from '@nestjs/swagger';

export class ChatGroupMemberResponseDto {
  @ApiProperty({
    type: Number,
  })
  id: number | string;

  @ApiProperty({
    type: Number,
  })
  groupId: number | string;

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
