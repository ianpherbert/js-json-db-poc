import { readFile } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

type CsvTransformer<T> = (csvLine: string) => T

export abstract class DataClass {
  filter(_filter: FilterType<this>): Boolean {
    return;
  }
  static fromString(line: string): DataClass {
    return this as unknown as DataClass;
  }
}

export type FilterType<T> = {
  [key in keyof Partial<T>]: string | number | boolean;
};



class DataController<T extends DataClass> {
  fileName: string;
  data: T[] = [];
  csvTransformer: CsvTransformer<T>
  constructor(fileName: string, csvTransformer: CsvTransformer<T>) {
    this.fileName = fileName;
    this.csvTransformer = csvTransformer;
  }

  readData = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathName = path.resolve(__dirname, this.fileName);
    const csv: string = await new Promise((res, rej) => {
      readFile(pathName, "utf-8", (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        res(data);
      });
    });
    this.data = csv.split("\n").map((line) => this.csvTransformer(line))
  };

  static async BuildDataController<T extends DataClass>(
    fileName: string,
    csvTransformer: CsvTransformer<T>
  ) {
    const controller = new DataController(fileName, csvTransformer);
    await controller.readData();
    return controller;
  }

  query(query: FilterType<T>) {
    return this.data.filter((it) => it.filter(query));
  }
}

export default DataController;
