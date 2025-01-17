import { DocumentStructure } from 'src/modules/embedding/create-embedding/infrastructure/document/document.provider';

const cleanText = (text: string) => {
  return text
    .replace(/\s+/g, ' ') // normalizacja białych znaków
    .replace(/,\s*,/g, ',') // usuń podwójne przecinki
    .replace(/\s{2,}/g, ' ') // usuń wielokrotne spacje
    .replace(/,\s+/g, ', ') // normalizuj spacje po przecinkach
    .trim();
};

export class DocumentParser {
  constructor(private rawDocument: DocumentStructure) {}

  public get document(): DocumentStructure {
    return this.rawDocument;
  }

  public processAll(): this {
    this.processManufacturer()
      .processMedicineName()
      .processComposition()
      .processUses()
      .processSideEffects();

    return this;
  }

  public processSideEffects(): this {
    this.rawDocument.sideEffects = this.rawDocument.sideEffects
      .replace(/\s+/g, ' ')
      .trim();

    return this;
  }

  public processManufacturer(): this {
    const commonAbbreviations = {
      'corp\\.?': 'Corp',
      'inc\\.?': 'Inc',
      'laborator(y|ies)': 'Laboratories',
      limited: 'Ltd',
      'llc\\.?': 'LLC',
      'pharmaceutical[s]?': 'Pharmaceuticals',
      'private\\s+limited': 'Pvt Ltd',
      'pvt\\.?\\s+ltd\\.?': 'Pvt Ltd',
    };

    let normalized = this.rawDocument.manufacturer.trim();

    // Zastosowanie standardowych skrótów
    Object.entries(commonAbbreviations).forEach(([pattern, replacement]) => {
      normalized = normalized.replace(new RegExp(pattern, 'gi'), replacement);
    });

    this.rawDocument.manufacturer = cleanText(normalized);

    return this;
  }

  public processMedicineName(): this {
    let normalized = cleanText(this.rawDocument.medicineName);

    const forms = {
      'caps\\.?\\s*': 'Capsule ',
      'inj\\.?\\s*': 'Injection ',
      'syr\\.?\\s*': 'Syrup ',
      'tab\\.?\\s*': 'Tablet ',
    };

    Object.entries(forms).forEach(([pattern, replacement]) => {
      normalized = normalized.replace(new RegExp(pattern, 'gi'), replacement);
    });

    this.rawDocument.medicineName = normalized
      .replace(/(\d+)\s*(mg|mcg|ml|%)/gi, '$1$2')
      .replace(/(\d+)(\s*)(mg|mcg|ml|%)/gi, '$1$3');

    return this;
  }

  public processUses(): this {
    this.rawDocument.uses = this.rawDocument.uses
      .replace(/Treatment of/g, '')
      .replace(/Prevention of/g, '')
      .split(/[.,]/)
      .map((use) => use.trim())
      .filter((use) => use.length > 0)
      .map((use) => {
        const isPreventive = use.toLowerCase().includes('prevention');
        const prefix = isPreventive ? 'Prevention of' : 'Treatment of';
        return `${prefix} ${use}`;
      })
      .join('. ');

    return this;
  }

  public processComposition(): this {
    const cleanedComposition = this.rawDocument.composition
      .replace(/[+]/g, ',') // zamiana + na przecinek
      .replace(/[^\w\s(),.-]/g, '') // usuń znaki specjalne zachowując nawiasy, kropki i myślniki
      .replace(/\s+/g, ' ') // normalizacja białych znaków
      .trim();

    const regex = /([^(]+)\s*\(([^)]+)\)/g;

    this.rawDocument.composition = Array.from(
      cleanedComposition.matchAll(regex),
    )
      ?.map(([, ingredient, dosage]) => `${ingredient} in a dose of ${dosage}`)
      .join(', ')
      .replace(/,\s*,/g, ',') // usuń podwójne przecinki
      .replace(/\s{2,}/g, ' ') // usuń wielokrotne spacje
      .replace(/,\s+/g, ', ') // normalizuj spacje po przecinkach
      .trim();

    return this;
  }
}
