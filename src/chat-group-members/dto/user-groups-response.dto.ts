import { ApiProperty } from '@nestjs/swagger';

export class LastMessageDto {
  @ApiProperty({ type: Number })
  id: number | string;

  @ApiProperty({ type: Number })
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

  @ApiProperty()
  createdAt: Date;
}

export class UserGroupItemDto {
  @ApiProperty({ type: Number })
  groupId: number | string;

  @ApiProperty({ type: String })
  groupName: string;

  @ApiProperty({
    type: String,
    example: 'read',
  })
  status: string;

  @ApiProperty({
    type: LastMessageDto,
    nullable: true,
  })
  lastreadMessage: LastMessageDto | null;
}

export class UserGroupsResponseDto {
  @ApiProperty({ type: Number })
  userId: number;

  @ApiProperty({ type: UserGroupItemDto, isArray: true })
  groups: UserGroupItemDto[];
}
