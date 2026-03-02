import { ApiProperty } from '@nestjs/swagger';

export class MarkMessageAsReadResponseDto {
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
    type: Number,
    nullable: true,
  })
  lastReadMessageId: number | string | null;

  @ApiProperty({
    type: String,
    example: 'read',
  })
  status: string | null;
}
