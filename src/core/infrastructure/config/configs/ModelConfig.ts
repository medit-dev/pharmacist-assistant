import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class ModelConfig {
  @IsString()
  @IsNotEmpty()
  public readonly embedding!: string;

  @IsString()
  @IsNotEmpty()
  public readonly name!: string;

  @IsString()
  @IsNotEmpty()
  public readonly apiKey!: string;

  @IsInt()
  @Type(() => Number)
  public readonly dimension!: number;

  @IsNumber()
  @Type(() => Number)
  public readonly temperature!: number;

  @IsInt()
  @Type(() => Number)
  public readonly maxTokens!: number;
}
