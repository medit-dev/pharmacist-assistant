import { VectorDatabasePort } from 'src/core/infrastructure/database/vector/vector-database.port';
import { Index } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { Injectable, Logger } from '@nestjs/common';
import { Document } from '@langchain/core/documents';
import { CsvProvider } from 'src/modules/embedding/create-embedding/infrastructure/csv/csv.provider';
import { bufferCount, catchError, mergeMap } from 'rxjs';
import {
  DocumentProvider,
  DocumentStructure,
} from 'src/modules/embedding/create-embedding/infrastructure/document/document.provider';
import { DocumentParser } from 'src/modules/embedding/create-embedding/infrastructure/document/document.util';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { SplitterPort } from 'src/core/infrastructure/spliter/splitter.port';
import { AppConfig } from 'src/core/infrastructure/config/configs/AppConfig';
import { OpenAIEmbeddings } from '@langchain/openai';

@Injectable()
export class CreateEmbeddingHandler {
  private readonly logger = new Logger(CreateEmbeddingHandler.name);

  constructor(
    private readonly vectorDatabase: VectorDatabasePort<
      Index,
      OpenAIEmbeddings,
      PineconeStore
    >,
    private readonly csvParser: CsvProvider,
    private readonly config: AppConfig,
    private readonly splitter: SplitterPort<
      RecursiveCharacterTextSplitter,
      Document
    >,
  ) {}

  async handle() {
    try {
      const store = await this.vectorDatabase.vectorStore();

      this.csvParser
        .parse()
        .pipe(
          bufferCount(this.config.batch),
          mergeMap(async (ev) => {
            const documents = ev.map((ev) => {
              const document: DocumentStructure = {
                composition: ev.Composition,
                manufacturer: ev.Manufacturer,
                medicineName: ev['Medicine Name'],
                sideEffects: ev.Side_effects,
                uses: ev.Uses,
              };

              const parser = new DocumentParser(document).processAll();
              return parser.document;
            });

            const docProvider = new DocumentProvider(new Date());
            const processedDocs = documents.flatMap((doc) => {
              return docProvider.generateAll(doc).documents;
            });

            const splitDocs = await this.splitter.splitDocuments(processedDocs);
            try {
              await store.addDocuments(splitDocs);
            } catch (err) {
              this.logger.error(err);
            }
          }),
          catchError((error) => {
            this.logger.error(`Error processing batch: ${error}`);
            throw error;
          }),
        )
        .subscribe();
    } catch (err: unknown) {
      this.logger.error(`Error parsing CSV: ${err}`);
      throw err;
    }
  }
}
