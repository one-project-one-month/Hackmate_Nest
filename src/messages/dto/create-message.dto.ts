import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateMessageDto {
  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  senderUserId: number;

  @ApiProperty({ type: String, example: 'Hello world!' })
  @IsNotEmpty()
  @IsString()
  body: string;

  @ApiPropertyOptional({ type: String, example: 'text', default: 'text' })
  @IsOptional()
  @IsString()
  messageType?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
