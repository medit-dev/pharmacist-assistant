import { BasePromptTemplate } from '@langchain/core/prompts';

export abstract class CorrespondingPort<Model> {
  abstract chat<Prompt extends BasePromptTemplate>(
    prompt: Prompt,
  ): Promise<unknown> | unknown;

  abstract get model(): Model;
}
