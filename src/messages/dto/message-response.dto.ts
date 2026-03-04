import { ApiProperty } from '@nestjs/swagger';

export class MessageResponseDto {
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
