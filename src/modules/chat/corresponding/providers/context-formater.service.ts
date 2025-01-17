import {
  DocumentType,
  ExtendedDocument,
} from 'src/modules/embedding/create-embedding/infrastructure/document/document.provider';

export class ContextFormater {
  constructor(private readonly labels: Record<DocumentType, string>) {}

  public formatContext(documents: Array<ExtendedDocument>): string {
    return documents
      .sort((a, b) => a.metadata.searchPriority - b.metadata.searchPriority)
      .map((doc) => {
        let content = doc.pageContent;
        if (doc.metadata.ingredients?.length) {
          content = `[Active ingredients: ${doc.metadata.ingredients.join(', ')}]\n${content}`;
        }
        const sectionType = this.labels[doc.metadata.documentType] || 'details';
        return `[${sectionType}]\n${content}`;
      })
      .join('\n\n');
  }
}
