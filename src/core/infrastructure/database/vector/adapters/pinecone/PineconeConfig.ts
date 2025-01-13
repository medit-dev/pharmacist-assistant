import { IsEnum, IsString } from 'class-validator';
import { ServerlessSpecCloudEnum } from '@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch/db_control';

export class PineconeConfig {
  @IsString()
  public readonly apiKey!: string;

  @IsString()
  public readonly index!: string;

  @IsString()
  public readonly region!: string;

  @IsEnum(ServerlessSpecCloudEnum)
  public readonly cloud!: ServerlessSpecCloudEnum;
}
