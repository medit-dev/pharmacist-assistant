import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ChatDTO } from 'src/modules/chat/corresponding/presentation/dtos/chat.dto';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { CorrespondingPort } from 'src/core/infrastructure/corresponding/corresponding.port';
import { VectorDatabasePort } from 'src/core/infrastructure/database/vector/vector-database.port';
import { Index } from '@pinecone-database/pinecone';
import { PineconeStore } from '@langchain/pinecone';
import { ExtendedDocument } from 'src/modules/embedding/create-embedding/infrastructure/document/document.provider';
import { ContextFormater } from 'src/modules/chat/corresponding/providers/context-formater.service';
import { ChatPromptTemplate } from '@langchain/core/prompts';

@Controller('chat')
export class CorrespondingController {
  constructor(
    private readonly corresponding: CorrespondingPort<ChatOpenAI>,
    private readonly contextDatabase: VectorDatabasePort<
      Index,
      OpenAIEmbeddings,
      PineconeStore
    >,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async chat(@Body() { query }: ChatDTO) {
    const contextLabels = {
      complete: 'COMPLETE INFORMATION',
      composition_effects: 'COMPOSITION AND EFFECTS',
      composition_uses: 'COMPOSITION AND USES',
      ingredient_specific: 'INGREDIENT INFORMATION',
      uses_effects: 'USES AND EFFECTS',
    };

    const questionPatterns = {
      composition: ['composition', 'content', 'what contains'],
      default: [],
      interactions: ['interactions', 'combine', 'use together'],
      sideEffects: ['effect', 'side effect', 'adverse reaction'],
      usage: ['how to use', 'dosage', 'how to take'],
    };

    const contextFormater = new ContextFormater(contextLabels);

    const result =
      await this.contextDatabase.similaritySearch<ExtendedDocument>(
        query,
        questionPatterns,
      );

    const context = contextFormater.formatContext(result);

    const prompt = ChatPromptTemplate.fromMessages([
      // System message
      [
        'system',
        `Jesteś PharmAssist - wyspecjalizowanym asystentem farmaceutycznym, którego zadaniem jest dostarczanie wiarygodnych informacji o lekach.

KLUCZOWE ZASADY:
1. Odpowiadasz WYŁĄCZNIE na podstawie dostarczonego kontekstu
2. Nie stawiasz diagnoz ani nie zalecasz leków
3. Nie modyfikujesz zaleceń lekarskich
4. Wszystkie odpowiedzi formułujesz w języku polskim
5. Zawsze informujesz o potrzebie konsultacji ze specjalistą`,
      ],
      // Format odpowiedzi
      [
        'ai',
        `Będę formułować odpowiedzi według schematu:

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
- Wskazanie sytuacji wymagających pilnej konsultacji`,
      ],
      // Pytanie użytkownika
      [
        'human',
        `Pytanie: {question}

Dostępny kontekst:
{context}`,
      ],

      // Potwierdzenie analizy
      [
        'ai',
        'Analizuję dostępne informacje, aby udzielić bezpiecznej i kompletnej odpowiedzi.',
      ],

      // Prośba o odpowiedź
      ['human', 'Proszę o odpowiedź zgodną z przedstawionym schematem.'],
    ]);

    return this.corresponding.chat(prompt, query, context);
  }
}
