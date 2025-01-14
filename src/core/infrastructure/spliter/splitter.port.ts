export abstract class SplitterPort<Splitter, Document> {
  abstract splitDocuments(
    documents: Array<Document>,
  ): Promise<Array<Document>> | Array<Document>;

  abstract get splitter(): Splitter;
}
