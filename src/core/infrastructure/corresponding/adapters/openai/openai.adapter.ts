import { Injectable } from '@nestjs/common';
import { ChatOpenAI } from '@langchain/openai';
import { CorrespondingPort } from 'src/core/infrastructure/corresponding/corresponding.port';
import { ModelConfig } from 'src/core/infrastructure/config/configs/ModelConfig';
import { BasePromptTemplate } from '@langchain/core/prompts';

@Injectable()
export class OpenAIAdapter extends CorrespondingPort<ChatOpenAI> {
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
  ): Promise<unknown> {
    const chain = prompt.pipe(this.model);

    return await chain.invoke(prompt);
  }

  get model(): ChatOpenAI {
    return this.chatOpenAIClient;
  }
}
