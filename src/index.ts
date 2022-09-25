import {readFileSync, writeFileSync} from 'fs';
import {Command, InvalidArgumentError} from 'commander';
import {
  decodeWeakAura,
  encodeWeakAura,
  parse,
  stringify,
} from './util/serialize';
import {compile, decompile} from './util/compile';

const program = new Command();

program
  .command('compile')
  .argument('<input-file>', 'WAML file to compile')
  .description('Compiles WAML into a WeakAuras import string')
  .option('-o, --output <file>', 'output file for the import string')
  .action((inputFile, options) => {
    const waml = readFileSync(inputFile, {encoding: 'utf8', flag: 'r'}).trim();
    const parsed = parse(waml);
    const compiled = compile(parsed);
    const encoded = encodeWeakAura(compiled);

    if (options.output) {
      writeFileSync(options.output, encoded);
    } else {
      console.log(encoded);
    }
  });

program
  .command('decompile')
  .argument('[input-string]', 'WeakAuras export string')
  .description('Converts a WeakAuras export string into WAML')
  .option(
    '-i, --input <file>',
    'input file to read from instead of input-string argument'
  )
  .option('-o, --output <file>', 'output WAML file')
  .action((inputString, options) => {
    if (!inputString && !options.input) {
      program.error(
        'decompile: either [input-string] or -i option must be provided'
      );
      return;
    }

    if (options.input) {
      inputString = readFileSync(options.input, {
        encoding: 'utf8',
        flag: 'r',
      }).trim();
    }

    const decoded = decodeWeakAura(inputString);
    const decompiled = decompile(decoded);
    const stringified = stringify(decompiled);

    if (options.output) {
      writeFileSync(options.output, stringified);
    } else {
      console.log(stringified);
    }
  });

program.parse();
