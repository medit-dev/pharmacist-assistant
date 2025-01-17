import { Injectable, Logger } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { CorrespondingPort } from 'src/core/infrastructure/corresponding/corresponding.port';
import { ModelConfig } from 'src/core/infrastructure/config/configs/ModelConfig';
import { BasePromptTemplate } from '@langchain/core/prompts';
import { MessageContent } from '@langchain/core/dist/messages/base';

@Injectable()
export class OpenAIAdapter extends CorrespondingPort<ChatOpenAI> {
  private readonly logger = new Logger(OpenAIAdapter.name);

  private readonly chatOpenAIClient: ChatOpenAI;

  constructor(public readonly config: ModelConfig) {
    super();

    this.chatOpenAIClient = new ChatOpenAI({
      apiKey: config.apiKey,
      maxTokens: config.maxTokens,
      model: this.config.name,
      temperature: config.temperature,
    });
  }
  public async chat<Prompt extends BasePromptTemplate>(
    prompt: Prompt,
    question: string,
    context: string,
  ): Promise<MessageContent> {
    try {
      const chain = prompt.pipe(this.model);

      const { content } = await chain.invoke({ context, question });

      return content;
    } catch (err) {
      this.logger.error(err);

      throw err;
    }
  }

  get model(): ChatOpenAI {
    return this.chatOpenAIClient;
  }
}
