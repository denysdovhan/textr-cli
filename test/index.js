import { spawn, exec, execFile, execFileSync } from 'child_process';
import assert from 'assert';
import fs from 'fs';

const textr = '../bin/textr';

const fixtures = fs.readFileSync('test/fixtures', 'utf-8');
const expected = fs.readFileSync('test/expected', 'utf-8');

describe('textr-cli', () => {

  describe('main', () => {

    it('should run without failing', () => {
      const cp = spawn(`${textr}`, {
        cwd: __dirname,
        stdio: 'inherit'
      });

      cp.on('error', err => assert.ifError(err));
      cp.on('close', code => assert.equal(code, 0));
    });

  });

  describe('input and output', () => {

    it('should load file as first argument', () => {
      const stdout = execFileSync(`${textr}`, ['fixtures'], {
        cwd: __dirname
      });
      assert.equal(stdout.toString(), fixtures);
    });

    it('should load text from stdin', (done) => {
      exec(`cat fixtures | ${textr}`, {
        cwd: __dirname
      }, (err, stdout) => {
        if (err) done(err);
        assert.equal(stdout, fixtures);
        done();
      });
    });

    it('should write to file with --out-file', () => {
      const stdout = execFileSync(`${textr}`, [
        'fixtures',
        '-o',
        'actual',
        '--transforms',
        'typographic-single-spaces,typographic-quotes,typographic-ellipses'], {
          cwd: __dirname
        });

      assert.equal(stdout.toString(), '');
      assert.equal(fs.readFileSync('test/actual', 'utf8'), expected);
    });

    it('should write to file with --o', () => {
      const stdout = execFileSync(`${textr}`, [
        'fixtures',
        '--out-file',
        'actual',
        '--transforms',
        'typographic-single-spaces,typographic-quotes,typographic-ellipses'], {
          cwd: __dirname
        });

      assert.equal(stdout.toString(), '');
      assert.equal(fs.readFileSync('test/actual', 'utf8'), expected);
    });

  });

  describe('transforms', () => {

    it('should not transform text without transformers', () => {
      const text = fs.createReadStream('test/fixtures');

      const cp = spawn(`${textr}`, {
        cwd: __dirname,
      });

      text.pipe(cp.stdin);

      cp.stdout.on('data', data => assert.equal(data.toString(), fixtures));
      cp.stdout.on('close', code => assert.equal(code, 0));
    });

    it('should load --transforms as string', () => {
      const stdout = execFileSync(`${textr}`, [
        'fixtures',
        '--transforms',
        'typographic-single-spaces,typographic-quotes,typographic-ellipses'], {
          cwd: __dirname
        });
      assert.equal(stdout.toString(), expected);
    });

    it('should load -t as string', () => {
      const stdout = execFileSync(`${textr}`, [
        'fixtures',
        '-t',
        'typographic-single-spaces,typographic-quotes,typographic-ellipses'], {
          cwd: __dirname
        });
      assert.equal(stdout.toString(), expected);
    });

    it('should load few --transforms', () => {
      const stdout = execFileSync(`${textr}`, [
        'fixtures',
        '--transforms',
        'typographic-single-spaces',
        '--transforms',
        'typographic-quotes',
        '--transforms',
        'typographic-ellipses'], {
          cwd: __dirname
        });
      assert.equal(stdout.toString(), expected);
    });

    it('should load few -t', () => {
      const stdout = execFileSync(`${textr}`, [
        'fixtures',
        '-t',
        'typographic-single-spaces',
        '-t',
        'typographic-quotes',
        '-t',
        'typographic-ellipses'], {
          cwd: __dirname
        });
      assert.equal(stdout.toString(), expected);
    });

  });

});
