// NPM Modules
import meow     from 'meow';
import stdin    from 'get-stdin';
import textr    from 'textr';

// Native Modules
import path     from 'path';
import fs       from 'fs';

/**
 * CLI app instance of Meow
 * More: https://www.npmjs.com/package/meow
 * @param  {Object|Array|String} Text that will be write on --help or -h
 * @param  {Object}              Minimist options (github.com/substack/minimist)
 * @return {Object}              A Meow CLI helper object
 */
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
    },
    alias: {
      t: 'transforms',
      h: 'help'
    }
  }
);

/**
 * Resolve file name with current dir
 * @param  {String} file Any relative filename
 * @return {String}      Resolved path to file
 */
const cwd = file =>
  path.resolve(process.cwd(), file);

/**
 * Render text string throught textr transformer
 * @param  {String} text Text that will be processed
 * @param  {Array}  tfs  Array of transformers
 * @return {Void}        Output into strout and exit
 */
const render = (text, tfs = []) => {
  process.stdout.write((textr().use.apply(null, tfs))(text));
  process.exit(0);
};

/**
 * Get array of transformers.
 * If list of transformers is a string, then split it.
 * After all, require everything.
 * @param  {String|Array} t String or Array that contains list of transformers
 * @return {Array}          Return array of transform functions
 */
const tfs = (t = cli.flags.transforms) =>
  (typeof t === 'string' ? t.split(',') : t).map(tf => require(tf));

/**
 * Entry point
 */
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
