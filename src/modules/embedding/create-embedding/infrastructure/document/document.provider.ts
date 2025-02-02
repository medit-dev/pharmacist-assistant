import { Document } from '@langchain/core/documents';

export type DocumentMetadata = Readonly<{
  medicineName: string;
  documentType: DocumentType;
  searchPriority: SearchPriority;
  ingredients?: Array<string>;
  source: string;
  lastUpdated: string;
  contains: {
    composition: boolean;
    uses: boolean;
    sideEffects: boolean;
  };
}>;

export type ExtendedDocument = Document & {
  metadata: DocumentMetadata;
};

export enum SearchPriority {
  HIGH = 1, // Najwyższy priorytet
  MEDIUM = 2, // Średni priorytet
  LOW = 3, // Najniższy priorytet
}

export const DOCUMENT_PRIORITIES: Record<DocumentType, SearchPriority> = {
  complete: SearchPriority.HIGH,
  composition_effects: SearchPriority.HIGH,
  composition_uses: SearchPriority.MEDIUM,
  ingredient_specific: SearchPriority.LOW,
  uses_effects: SearchPriority.MEDIUM,
};

export type DocumentKey =
  | 'medicineName'
  | 'composition'
  | 'manufacturer'
  | 'uses'
  | 'sideEffects';

export enum DocumentType {
  COMPLETE = 'complete',
  COMPOSITION_EFFECTS = 'composition_effects',
  USES_EFFECTS = 'uses_effects',
  COMPOSITION_USES = 'composition_uses',
  INGREDIENT_SPECIFIC = 'ingredient_specific',
}

export type DocumentStructure = Record<DocumentKey, string>;

export const DOCUMENT_TEMPLATES = {
  complete: (document: DocumentStructure) => `
    Medicine: ${document.medicineName}
    Composition: ${document.composition})
    Uses: ${document.uses}
    Side effects: ${document.sideEffects}
  `,

  composition_effects: (document: DocumentStructure) => `
    Medicine ${document.medicineName} contains ${document.composition}).
    The following side effects may occur while using this medicine: ${document.sideEffects}.
  `,

  composition_uses: (document: DocumentStructure) => `
    Medicine ${document.medicineName} containing ${document.composition})
    is used in the following cases: ${document.uses}.
  `,

  ingredient_specific: (document: DocumentStructure, ingredient: string) => `
    Ingredient ${ingredient} is present in medicine ${document.medicineName}.
    It is used for: ${document.uses}.
    It may cause: ${document.sideEffects}.
  `,

  uses_effects: (document: DocumentStructure) => `
    Medicine ${document.medicineName} used for: ${document.uses}
    may cause the following side effects: ${document.sideEffects}.
  `,
};

export class DocumentProvider {
  constructor(
    private readonly lastUpdated: Date,
    private readonly docs: Array<Document> = [],
    private readonly source: string = 'medicine_database',
  ) {}

  public generateAll(parsedDocument: DocumentStructure) {
    this.generateCompleteDocument(parsedDocument)
      .generateCompositionEffectsDocument(parsedDocument)
      .generateCompositionUsesDocument(parsedDocument)
      .generateUsesEffectsDocument(parsedDocument)
      .generateCompositionSpecificDocument(parsedDocument);

    return this;
  }

  public get documents(): Array<Document> {
    return this.docs;
  }

  private generateMetadata(
    parsedDocument: DocumentStructure,
  ): Omit<DocumentMetadata, 'searchPriority' | 'documentType' | 'ingredients'> {
    return {
      contains: {
        composition: true,
        sideEffects: parsedDocument.sideEffects.length > 0,
        uses: parsedDocument.uses.length > 0,
      },
      lastUpdated: this.lastUpdated.toISOString(),
      medicineName: parsedDocument.medicineName,
      source: this.source,
    };
  }

  public generateCompleteDocument(parsedDocument: DocumentStructure): this {
    this.docs.push(
      new Document({
        metadata: {
          ...this.generateMetadata(parsedDocument),
          documentType: DocumentType.COMPLETE,
          searchPriority: DOCUMENT_PRIORITIES.complete,
        },
        pageContent: DOCUMENT_TEMPLATES.complete(parsedDocument).trim(),
      }),
    );

    return this;
  }

  public generateCompositionEffectsDocument(
    parsedDocument: DocumentStructure,
  ): this {
    this.docs.push(
      new Document({
        metadata: {
          ...this.generateMetadata(parsedDocument),
          documentType: DocumentType.COMPOSITION_EFFECTS,
          searchPriority: DOCUMENT_PRIORITIES.composition_effects,
        },
        pageContent:
          DOCUMENT_TEMPLATES.composition_effects(parsedDocument).trim(),
      }),
    );

    return this;
  }

  public generateCompositionUsesDocument(
    parsedDocument: DocumentStructure,
  ): this {
    this.docs.push(
      new Document({
        metadata: {
          ...this.generateMetadata(parsedDocument),
          documentType: DocumentType.COMPOSITION_USES,
          searchPriority: DOCUMENT_PRIORITIES.composition_uses,
        },
        pageContent: DOCUMENT_TEMPLATES.composition_uses(parsedDocument).trim(),
      }),
    );

    return this;
  }

  public generateUsesEffectsDocument(parsedDocument: DocumentStructure): this {
    this.docs.push(
      new Document({
        metadata: {
          ...this.generateMetadata(parsedDocument),
          documentType: DocumentType.USES_EFFECTS,
          searchPriority: DOCUMENT_PRIORITIES.uses_effects,
        },
        pageContent: DOCUMENT_TEMPLATES.uses_effects(parsedDocument).trim(),
      }),
    );

    return this;
  }

  public generateCompositionSpecificDocument(
    parsedDocument: DocumentStructure,
  ): this {
    parsedDocument.composition.split(',').forEach((ingredient) => {
      const trimmedIngredient = ingredient.trim();

      this.docs.push(
        new Document({
          metadata: {
            ...this.generateMetadata(parsedDocument),
            documentType: DocumentType.INGREDIENT_SPECIFIC,
            ingredients: [trimmedIngredient],
            searchPriority: DOCUMENT_PRIORITIES.ingredient_specific,
          },
          pageContent: DOCUMENT_TEMPLATES.ingredient_specific(
            parsedDocument,
            trimmedIngredient,
          ).trim(),
        }),
      );
    });

    return this;
  }
}
