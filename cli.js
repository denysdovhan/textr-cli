// Modules
import meow     from 'meow';
import stdin    from 'get-stdin';
import textr    from 'textr';

// Native
import path     from 'path';
import fs       from 'fs';

// package.json
import pkg      from './package';

const cli = meow(`
  Usage
    $ textr

  Options
    -t, --transforms    Array of transformers
    -w, --watch         Watch sources
    -d, --diff          Output diff instead of result
`,
  {
    default: {
      transforms: [],
      watch: false,
      diff: false
    },
    alias: {
      t: 'transforms',
      w: 'watch',
      d: 'diff'
    }
  }
);

// Text that's gonna be transformed
let text = '';

// Resolve dir depend on cwd()
const resolveDir = file =>
  path.resolve(process.cwd(), file);

// Write output
const write = (text) => {
  process.stdout.write((textr().use.apply(null, tfs))(text));
  process.exit(0);
};

// Get transformers from -t or --transforms
let tfs = cli.flags.transforms;
if (tfs) {
  // if only one -t was used, then it's string, so split it
  // After that, require everything
  tfs = (typeof tfs === 'string' ? tfs.split(',') : tfs).map(tf => require(tf));
}

// Get input
if (cli.input[0]) {
  // for files
  const str = fs.readFileSync(resolveDir(cli.input[0])).toString();
  write(str);
} else {
  // For stdin
  stdin().then(str => write(str));
}
