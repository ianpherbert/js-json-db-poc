import { readdir, statSync, writeFile } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join, basename, extname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataFolder = join(__dirname, 'data'); // Adjust 'data' if your folder path is different
const outputFile = join(__dirname, 'src/dataTypes.ts'); // Output TypeScript definitions file

readdir(dataFolder, (err, files) => {
  if (err) {
    console.error('Error reading the data directory:', err);
    return;
  }

  // Filter out non-files and possibly unwanted file types
  const fileNames = files.filter(file => statSync(join(dataFolder, file)).isFile())
                         .map(file => basename(file, extname(file)));

  // Create a TypeScript type with all file names as union of string literals
  const typeName = 'DataFileNames';
  const typeContent = `export type ${typeName} = ${fileNames.map(name => `'${name}'`).join(' | ')};\n`;

  writeFile(outputFile, typeContent, (err) => {
    if (err) {
      console.error('Error writing TypeScript definitions:', err);
      return;
    }
    console.log(`TypeScript type definition for file names has been generated in ${outputFile}`);
  });
});
