// NPM Modules
import meow     from 'meow';
import stdin    from 'get-stdin';
import textr    from 'textr';

// Native Modules
import path     from 'path';
import fs       from 'fs';


const cli = meow(`
  Usage
    $ textr

  Options
    -t, --transforms    Array of transformers
    -h, --help          Show this message

  Examples
    $ textr foo.md -t typographic-quotes -t typographic-quotes
    $ textr foo.md -t typographic-single-spaces,typographic-quotes
    $ cat foo.md | textr --transforms=typographic-single-spaces
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

const cwd = file =>
  path.resolve(process.cwd(), file);

const render = (text, tfs = []) => {
  process.stdout.write((textr().use.apply(null, tfs))(text));
  process.exit(0);
};

const tfs = (t = cli.flags.transforms) =>
  (typeof t === 'string' ? t.split(',') : t).map(tf => require(tf));

// Get input
if (cli.input[0]) {
  // If there is first argument, then read this file
  render(
    fs.readFileSync(cwd(cli.input[0])).toString(),
    tfs()
  );
} else {
  // If there's no first argument, then try to read stdin
  stdin()
    .then(str => render(str, tfs()))
    .catch(err => err);
}
