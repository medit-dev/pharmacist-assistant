import { IsInt, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class AppConfig {
  @IsInt()
  @Type(() => Number)
  public readonly timeout: number = 3000;

  @IsInt()
  @Type(() => Number)
  public readonly port: number = 4000;

  @IsString()
  public readonly hostname: string = 'localhost';

  @IsString()
  public readonly logLevel: string = 'debug';
}
