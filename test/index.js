import { spawn } from 'child_process';
import assert    from 'assert';

describe('textr-cli', () => {

  it('should run without falling', () => {
    const cp = spawn('../cli.es5.js', {
      cwd: __dirname,
      stdio: 'inherit'
    });

    cp.on('error', err => assert.ifError(err));
    cp.on('close', code => assert.equal(code, 0));
  });

});
