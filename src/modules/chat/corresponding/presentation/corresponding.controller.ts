import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
} from '@nestjs/common';
import { ChatDTO } from 'src/modules/chat/corresponding/presentation/dtos/chat.dto';
import { ChatOpenAI } from '@langchain/openai';
// import { ModelConfig } from 'src/core/infrastructure/config/configs/ModelConfig';
import { CorrespondingPort } from 'src/core/infrastructure/corresponding/corresponding.port';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { SearchService } from 'src/modules/chat/corresponding/providers/search.service';

// const responseSchema = {
//   $id: 'https://example.com/product.schema.json',
//   $schema: 'https://json-schema.org/draft/2020-12/schema',
//   properties: {
//     answer: {
//       description: "The answer to the user's question",
//       type: 'string',
//     },
//   },
//   required: ['answer'],
//   title: 'ResponseFormatter',
//   type: 'object',
// };

@Controller('chat')
export class CorrespondingController {
  private readonly logger = new Logger(CorrespondingController.name);
  private readonly searchService: SearchService;

  constructor(private readonly corresponding: CorrespondingPort<ChatOpenAI>) {
    this.searchService = new SearchService({
      composition: ['skład', 'zawartość', 'co zawiera'],
      default: [],
      interactions: ['interakcje', 'łączyć', 'stosować razem'],
      sideEffects: ['efekt', 'skutek', 'działanie niepożądane'],
      usage: ['jak stosować', 'dawkowanie', 'jak używać'],
    });
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(@Body() { query }: ChatDTO) {
    // const content = await this.model
    //   .withStructuredOutput(responseSchema)
    //   .invoke(query);

    const systemPrompt =
      new SystemMessage(`Jesteś PharmAssist - wyspecjalizowanym asystentem farmaceutycznym, którego zadaniem jest dostarczanie wiarygodnych informacji o lekach.

KLUCZOWE ZASADY:
1. Odpowiadasz WYŁĄCZNIE na podstawie dostarczonego kontekstu
2. Nie stawiasz diagnoz ani nie zalecasz leków
3. Nie modyfikujesz zaleceń lekarskich
4. Wszystkie odpowiedzi formułujesz w języku polskim
5. Zawsze informujesz o potrzebie konsultacji ze specjalistą`);

    const userPrompt = new HumanMessage(
      `Pytanie: {question}

Dostępny kontekst:
{context}`,
    );

    const aiPrompt = new AIMessage(`Będę formułować odpowiedzi według schematu:

1️⃣ GŁÓWNA INFORMACJA
- Zwięzła odpowiedź na pytanie
- Zaznaczenie, jeśli informacja jest niepełna

2️⃣ SZCZEGÓŁOWE WYJAŚNIENIE
- Rozwinięcie głównej informacji
- Dodatkowe istotne dane z kontekstu

3️⃣ OSTRZEŻENIA I PRZECIWWSKAZANIA
- Kluczowe ostrzeżenia
- Grupy ryzyka
- Bezwzględne przeciwwskazania

4️⃣ WSKAZÓWKI PRAKTYCZNE
- Zalecenia dotyczące stosowania
- Ważne informacje praktyczne

5️⃣ ZALECENIA KOŃCOWE
- Przypomnienie o konsultacji z lekarzem/farmaceutą
- Wskazanie sytuacji wymagających pilnej konsultacji`);

    const prompt = ChatPromptTemplate.fromMessages([
      systemPrompt,
      aiPrompt,
      userPrompt,
    ]);

    const content = await this.corresponding.chat(prompt);

    this.logger.log(content);

    return content;
  }
}
