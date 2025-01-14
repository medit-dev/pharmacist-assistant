import { Injectable } from '@nestjs/common';
import { SplitterPort } from 'src/core/infrastructure/spliter/splitter.port';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { SplitterConfig } from 'src/core/infrastructure/spliter/SplitterConfig';

@Injectable()
export class RecursiveCharacterTextSplitterAdapter extends SplitterPort<
  RecursiveCharacterTextSplitter,
  Document
> {
  private readonly recursiveCharacterTextSplitter: RecursiveCharacterTextSplitter;

  constructor(private readonly config: SplitterConfig) {
    super();

    this.recursiveCharacterTextSplitter = new RecursiveCharacterTextSplitter({
      chunkOverlap: this.config.chunkOverlap,
      chunkSize: this.config.chunkSize,
      separators: ['\n', '. ', ', ', ' '],
    });
  }

  async splitDocuments(documents: Array<Document>): Promise<Array<Document>> {
    return await this.recursiveCharacterTextSplitter.splitDocuments(documents);
  }

  get splitter(): RecursiveCharacterTextSplitter {
    return this.recursiveCharacterTextSplitter;
  }
}
