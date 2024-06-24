import { readFile, writeFile } from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { DataFileNames } from "./dataTypes";


type CsvTransformer<T> = (csvLine: string) => T

export abstract class DataClass {
  filter(_filter: FilterType<this>): Boolean {
    return;
  }
}

export type FilterType<T> = {
  [key in keyof Partial<T>]: string | number | boolean;
};



class DataController<T extends DataClass> {
  fileName: string;
  data: T[] = [];
  constructor(fileName: DataFileNames) {
    this.fileName = `../data/${fileName}.json`;
  }

  readData = async () => {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const pathName = path.resolve(__dirname, this.fileName);
    const json: string = await new Promise((res, rej) => {
      readFile(pathName, "utf-8", (err, data) => {
        if (err) {
          rej(err);
          return;
        }
        res(data);
      });
    });
    this.data = JSON.parse(json)
  };

  static async BuildDataController<T extends DataClass>(
    fileName: DataFileNames,
  ) {
    const controller = new DataController<T>(fileName);
    await controller.readData();
    return controller;
  }

  query(query: FilterType<T>) {
    return this.data.filter((it) => it.filter(query));
  }
}

export default DataController;
