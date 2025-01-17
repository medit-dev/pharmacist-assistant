import { BasePromptTemplate } from '@langchain/core/prompts';
import { MessageContent } from '@langchain/core/dist/messages/base';

export abstract class CorrespondingPort<Model> {
  abstract chat<Prompt extends BasePromptTemplate>(
    prompt: Prompt,
    question: string,
    context: string,
  ): Promise<MessageContent> | MessageContent;

  abstract get model(): Model;
}
