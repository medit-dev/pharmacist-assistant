import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { AppConfig } from 'src/core/infrastructure/config/configs/AppConfig';
import { PineconeConfig } from 'src/core/infrastructure/database/vector/adapters/pinecone/PineconeConfig';
import { ModelConfig } from 'src/core/infrastructure/config/configs/ModelConfig';

export class RootConfig {
  @IsString()
  @IsNotEmpty()
  public readonly env: string = 'development';

  @Type(() => AppConfig)
  @ValidateNested()
  public readonly app!: AppConfig;

  @Type(() => PineconeConfig)
  @ValidateNested()
  public readonly pinecone!: PineconeConfig;

  @Type(() => ModelConfig)
  @ValidateNested()
  public readonly model!: ModelConfig;
}
