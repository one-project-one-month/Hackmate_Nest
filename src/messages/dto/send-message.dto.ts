import { IsInt, Min } from 'class-validator';
import { CreateMessageDto } from './create-message.dto';

export class SendMessageDto extends CreateMessageDto {
  @IsInt()
  @Min(1)
  groupId: number;
}
