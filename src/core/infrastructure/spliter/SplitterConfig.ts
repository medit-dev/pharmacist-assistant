import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class SplitterConfig {
  @IsInt()
  @Type(() => Number)
  public readonly chunkSize: number = 500;

  @IsInt()
  @Type(() => Number)
  public readonly chunkOverlap: number = 50;
}
