// Modules
import minimist from 'minimist';
import stdin    from 'get-stdin';
import textr    from 'textr';

// Native
import path     from 'path';
import fs       from 'fs';

// package.json
import pkg      from './package';

/**
 * Command line arguments
 * @param  {Array} process.argv Array of arguments
 * @return {Array}              Parsed arguments
 */
const args = minimist(process.argv.slice(2));

// Text that's gonna be transformed
let text = '';

// Resolve dir depend on cwd()
const resolveDir = file =>
  path.resolve(process.cwd(), file);

// Get transformers from -t or --transforms
let tfs = (args.t || args.transforms);
if (tfs) {
  // if only one -t was used, then it's string, so split it
  // After that, require everything
  tfs = (typeof tfs === 'string' ? tfs.split(',') : tfs).map(tf => require(tf));
}

// Write output
const write = (text) => {
  process.stdout.write((textr().use.apply(null, tfs))(text));
  process.exit(0);
};

// Get input
if (args._[0]) {
  // for files
  const str = fs.readFileSync(resolveDir(args._[0])).toString();
  write(str);
} else {
  // For stdin
  stdin().then(str => write(str));
}
