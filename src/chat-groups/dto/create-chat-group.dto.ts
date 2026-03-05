import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateChatGroupDto {
  @ApiProperty({ type: String, example: 'Blood Donation System' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({
    type: String,
    example: 'A group to build Blood Donation System',
  })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ type: Number })
  @IsNotEmpty()
  @IsNumber()
  createdByUserId: number;
}
