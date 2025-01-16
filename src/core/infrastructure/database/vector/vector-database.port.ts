export abstract class VectorDatabasePort<Index> {
  abstract getIndex(): Promise<Index | undefined> | Index | undefined;
  abstract createIndex(): Promise<void> | void;
}
