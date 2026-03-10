import { IsInt, Min } from 'class-validator';

export class JoinGroupDto {
  @IsInt()
  @Min(1)
  groupId: number;
}
