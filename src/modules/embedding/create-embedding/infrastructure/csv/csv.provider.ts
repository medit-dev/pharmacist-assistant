import { Injectable } from '@nestjs/common';
import { AppConfig } from 'src/core/infrastructure/config/configs/AppConfig';
import { parse } from 'csv-parse';
import * as fs from 'node:fs';
import { join } from 'path';

export type MedicineRawData = Readonly<{
  'Medicine Name': string;
  Composition: string;
  Manufacturer: string;
  Uses: string;
  Side_effects: string;
}>;

@Injectable()
export class CsvProvider {
  constructor(private readonly config: AppConfig) {}

  async parse() {
    return new Promise((resolve, reject) => {
      fs.createReadStream(join(process.cwd(), this.config.csvFilename))
        .on('error', (error) => {
          console.error('Error reading file:', error);
          reject(error);
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
          reject(error);
        })
        .on('data', (data: MedicineRawData) => {
          console.log(data);
        })
        .on('end', () => {
          console.log('CSV processing completed');
          resolve(true);
        });
    });
  }
}
