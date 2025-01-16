import { IsNotEmpty, IsString } from 'class-validator';

export class ChatDTO {
  @IsNotEmpty()
  @IsString()
  public readonly query: string;
}
