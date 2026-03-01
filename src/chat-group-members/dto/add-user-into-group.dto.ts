import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
} from 'class-validator';

export class AddUserIntoGroupDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty()
  @IsNumber()
  groupId: number;

  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty()
  @IsNumber()
  userId: number;

  @ApiPropertyOptional({ type: String, example: 'member' })
  @IsOptional()
  @IsString()
  role: string;

  @ApiPropertyOptional({ type: Number, nullable: true })
  @IsOptional()
  @IsNumber()
  lastReadMessageId: number | null;

  @ApiPropertyOptional({ type: Date, nullable: true })
  @IsOptional()
  @IsDateString()
  mutedUntil: Date | null;

  @ApiPropertyOptional({ type: String, example: 'active' })
  @IsOptional()
  @IsString()
  status: string | null;
}
