import { DocumentType } from 'src/modules/embedding/create-embedding/infrastructure/document/document.provider';

type BaseSearchFilter = {
  searchPriority: { $lte: number };
  documentType: { $in: DocumentType[] } | DocumentType;
};

export type SearchFilter = Readonly<BaseSearchFilter>;

export type SearchParams = Readonly<{
  limit: number;
  filter: SearchFilter;
}>;

const SEARCH_STRATEGIES = {
  composition: {
    filter: {
      documentType: {
        $in: [
          DocumentType.COMPLETE,
          DocumentType.INGREDIENT_SPECIFIC,
        ] as DocumentType[],
      },
      searchPriority: { $lte: 2 },
    },
    limit: 3,
  },
  default: {
    filter: {
      documentType: DocumentType.COMPLETE,
      searchPriority: { $lte: 2 },
    },
    limit: 2,
  },
  interactions: {
    filter: {
      documentType: {
        $in: [
          DocumentType.COMPLETE,
          DocumentType.USES_EFFECTS,
          DocumentType.COMPOSITION_EFFECTS,
        ] as DocumentType[],
      },
      searchPriority: { $lte: 2 },
    },
    limit: 4,
  },
  sideEffects: {
    filter: {
      documentType: {
        $in: [
          DocumentType.COMPLETE,
          DocumentType.COMPOSITION_EFFECTS,
          DocumentType.USES_EFFECTS,
        ] as DocumentType[],
      },
      searchPriority: { $lte: 3 },
    },
    limit: 3,
  },
  usage: {
    filter: {
      documentType: {
        $in: [
          DocumentType.COMPLETE,
          DocumentType.COMPOSITION_USES,
        ] as DocumentType[],
      },
      searchPriority: { $lte: 3 },
    },
    limit: 3,
  },
} as const satisfies Record<string, SearchParams>;

export type SearchStrategy = keyof typeof SEARCH_STRATEGIES;

export type QuestionPatterns = Readonly<{
  [K in SearchStrategy]: ReadonlyArray<string>;
}>;

export class SearchService {
  private readonly compiledPatterns: ReadonlyMap<
    SearchStrategy,
    ReadonlyArray<RegExp>
  >;

  constructor(questionPatterns: QuestionPatterns) {
    this.compiledPatterns = new Map(
      (
        Object.entries(questionPatterns) as [
          SearchStrategy,
          readonly string[],
        ][]
      ).map(([type, patterns]) => [
        type,
        Object.freeze(patterns.map((pattern) => new RegExp(pattern, 'i'))),
      ]),
    );
  }

  public getSearchParams(question: string): SearchParams {
    const normalizedQuestion = question.trim().toLowerCase();

    for (const [type, patterns] of this.compiledPatterns) {
      if (patterns.some((pattern) => pattern.test(normalizedQuestion))) {
        return SEARCH_STRATEGIES[type];
      }
    }

    return SEARCH_STRATEGIES.default;
  }
}
