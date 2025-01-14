import { Command, CommandRunner } from 'nest-commander';
import { CreateEmbeddingHandler } from 'src/modules/embedding/create-embedding/application/createEmbedding.handler';

@Command({ description: 'Create Embedding', name: 'create-embedding' })
export class CreateEmbeddingCommand extends CommandRunner {
  constructor(private readonly handler: CreateEmbeddingHandler) {
    super();
  }

  async run() {
    await this.handler.handle();
  }
}
