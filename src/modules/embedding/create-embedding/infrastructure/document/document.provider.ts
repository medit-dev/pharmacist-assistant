import { Document } from '@langchain/core/documents';

export enum SearchPriority {
  HIGH = 1, // Najwyższy priorytet
  MEDIUM = 2, // Średni priorytet
  LOW = 3, // Najniższy priorytet
}

export type DocumentType =
  | 'complete'
  | 'composition_effects' // skład + skutki uboczne
  | 'composition_uses' // skład + zastosowania
  | 'uses_effects' // zastosowania + skutki uboczne
  | 'ingredient_specific'; // informacje o konkretnym składniku

export const DOCUMENT_PRIORITIES: Record<DocumentType, SearchPriority> = {
  complete: SearchPriority.HIGH,
  composition_effects: SearchPriority.HIGH,
  composition_uses: SearchPriority.MEDIUM,
  ingredient_specific: SearchPriority.LOW,
  uses_effects: SearchPriority.MEDIUM,
};

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

export type DocumentKey =
  | 'medicineName'
  | 'composition'
  | 'manufacturer'
  | 'uses'
  | 'sideEffects';

export type DocumentStructure = Record<DocumentKey, string>;

export const DOCUMENT_TEMPLATES = {
  complete: (document: DocumentStructure) => `
    Lek: ${document.medicineName}
    Skład: ${document.composition})
    Zastosowanie: ${document.uses}
    Skutki uboczne: ${document.sideEffects}
  `,

  composition_effects: (document: DocumentStructure) => `
    Lek ${document.medicineName} zawiera ${document.composition}).
    Podczas stosowania tego leku mogą wystąpić następujące skutki uboczne: ${document.sideEffects}.
  `,

  composition_uses: (document: DocumentStructure) => `
    Lek ${document.medicineName} zawierający ${document.composition})
    jest stosowany w następujących przypadkach: ${document.uses}.
  `,

  ingredient_specific: (document: DocumentStructure, ingredient: string) => `
    Składnik ${ingredient} występuje w leku ${document.medicineName}.
    Jest stosowany w: ${document.uses}.
    Może powodować: ${document.sideEffects}.
  `,

  uses_effects: (document: DocumentStructure) => `
    Lek ${document.medicineName} stosowany w: ${document.uses}
    może powodować następujące skutki uboczne: ${document.sideEffects}.
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
          documentType: 'complete',
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
          documentType: 'composition_effects',
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
          documentType: 'composition_uses',
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
          documentType: 'uses_effects',
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
            documentType: 'ingredient_specific',
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
