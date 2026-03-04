import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class MarkMessageAsReadDto {
  @ApiProperty({ type: Number, example: 1 })
  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
