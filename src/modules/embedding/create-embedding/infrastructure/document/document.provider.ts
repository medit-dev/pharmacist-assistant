import { Injectable } from '@nestjs/common';

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

export type MedicineDocument = Readonly<{
  pageContent: string;
  metadata: {
    medicineName: string;
    documentType: DocumentType;
    searchPriority: SearchPriority;
    ingredients: Array<string>;
    source: string;
    lastUpdated: string;
    contains: {
      composition: boolean;
      uses: boolean;
      sideEffects: boolean;
    };
  };
}>;

@Injectable()
export class DocumentProvider {}
