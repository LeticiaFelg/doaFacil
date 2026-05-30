const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

const root = path.resolve(__dirname, '..');

function run(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: root,
      shell: process.platform === 'win32',
      stdio: options.stdio || 'inherit'
    });

    child.on('exit', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${command} ${args.join(' ')} exited with code ${code}`));
    });
  });
}

function waitFor(url, timeoutMs = 90000) {
  const startedAt = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      const req = http.get(url, (res) => {
        res.resume();
        if (res.statusCode >= 200 && res.statusCode < 500) {
          resolve();
        } else {
          retry();
        }
      });

      req.on('error', retry);
      req.setTimeout(3000, () => {
        req.destroy();
        retry();
      });
    };

    const retry = () => {
      if (Date.now() - startedAt > timeoutMs) {
        reject(new Error(`Timeout esperando ${url}`));
      } else {
        setTimeout(check, 1500);
      }
    };

    check();
  });
}

async function main() {
  console.log('Subindo containers do banco e da API...');
  await run('docker', ['compose', 'up', '--build', '-d']);

  console.log('Aguardando API em http://localhost:5000/api/health ...');
  await waitFor('http://localhost:5000/api/health');

  console.log('API pronta. Subindo frontend em http://localhost:8000 ...');
  const frontend = spawn(process.execPath, [path.join('scripts', 'frontend-server.js')], {
    cwd: root,
    shell: process.platform === 'win32',
    stdio: 'inherit'
  });

  const stop = () => {
    if (!frontend.killed) frontend.kill();
    process.exit();
  };

  process.on('SIGINT', stop);
  process.on('SIGTERM', stop);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
