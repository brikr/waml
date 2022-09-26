import {readFileSync, writeFileSync} from 'fs';
import {Command} from 'commander';
import {
  decodeWeakAura,
  encodeWeakAura,
  parseFromFile,
  stringify,
} from './util/serialize';
import {compile, decompile} from './util/compile';
import {logger} from './util/logger';
import {dirname} from 'path';

const program = new Command();

program
  .command('compile')
  .argument('<input-file>', 'WAML file to compile')
  .description('Compiles WAML into a WeakAuras import string')
  .option('-o, --output <file>', 'output file for the import string')
  .option(
    '-y, --yaml-only',
    'apply templates and compile to final YAML form instead of WeakAuras import string'
  )
  .action((inputFile, options) => {
    const parsed = parseFromFile(inputFile);
    const compiled = compile(parsed, dirname(inputFile));

    let output: string;
    if (options.yamlOnly) {
      // decompile now that templates etc. are baked in
      output = stringify(decompile(compiled));
    } else {
      output = encodeWeakAura(compiled);
    }

    if (options.output) {
      writeFileSync(options.output, output);
    } else {
      console.log(output);
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

program
  .option('-d, --debug', 'Print debug information', false)
  .hook('preAction', thisCommand => {
    if (thisCommand.opts().debug) {
      logger.debugMode = true;
    }
  });

program.parse();
