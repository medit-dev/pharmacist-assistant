import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { AppConfig } from 'src/core/infrastructure/config/configs/AppConfig';

export class RootConfig {
  @IsString()
  @IsNotEmpty()
  public readonly env: string = 'development';

  @Type(() => AppConfig)
  @ValidateNested()
  public readonly app!: AppConfig;
}
