import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  IsDate,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class AddUserIntoGroupDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  groupId: number;

  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId: number;

  @ApiPropertyOptional({ type: String, example: 'member' })
  @IsOptional()
  @IsString()
  role: string;

  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  lastReadMessageId: number | null;

  @ApiPropertyOptional({ type: Date, nullable: true })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  mutedUntil: Date | null;

  @ApiPropertyOptional({ type: String, example: 'unread' })
  @IsOptional()
  @IsString()
  status?: string;
}
