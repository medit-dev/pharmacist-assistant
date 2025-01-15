import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/core/infrastructure/config/configs/AppConfig';
import { parse } from 'csv-parse';
import * as fs from 'node:fs';
import { join } from 'path';
import { Observable } from 'rxjs';

export type MedicineRawKey =
  | 'Medicine Name'
  | 'Composition'
  | 'Manufacturer'
  | 'Uses'
  | 'Side_effects';

export type MedicineRawData = Record<MedicineRawKey, string>;

@Injectable()
export class CsvProvider {
  constructor(private readonly config: AppConfig) {}

  parse(): Observable<MedicineRawData> {
    return new Observable((subscriber) => {
      fs.createReadStream(join(process.cwd(), this.config.csvFilename))
        .on('error', (error) => {
          console.error('Error reading file:', error);
          subscriber.error(error);
        })
        .pipe(
          parse({
            columns: true,
            skip_empty_lines: true,
            trim: true,
          }),
        )
        .on('error', (error) => {
          console.error('Error parsing CSV:', error);
          subscriber.error(error);
        })
        .on('data', (data: MedicineRawData) => {
          subscriber.next(data);
        })
        .on('end', () => {
          console.log('CSV processing completed');
          subscriber.complete();
        });
    });
  }
}
