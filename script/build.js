const path = require('path');
const rollup = require('rollup');
const argv = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');
const ora = require('ora');
const waitOn = require('wait-on');
const electron = require('electron-connect').server.create({ stopOnClose: true });
require('dotenv').config({ path: path.join(__dirname, '../.env') })
const options = require('./rollup.config');
const net = require('net');
const { URL } = require('url');

const opt = options(argv.env);
const TAG = '[script/build.js]';
const spinner = ora(`${TAG} Electron build...`);

const watchFunc = function () {
    // once here, all resources are available
    const watcher = rollup.watch(opt);
    watcher.on('change', filename => {
      const log = chalk.green(`change -- ${filename}`);
      console.log(TAG, log);
    });
    watcher.on('event', ev => {
      if (ev.code === 'END') {
        electron.electronState === 'init' ? electron.start() : electron.restart();
      } else if (ev.code === 'ERROR') {
        console.log(ev.error)
      }
    });
}

const resource = `http://localhost:${process.env.PORT}/index.html`;

if (argv.watch) {
  waitOn({
    resources: [resource],
    timeout: 5000,
  }, err => {
    if (err) {
        const { port, hostname } = new URL(resource);
        const serverSocket = net.connect(port || 80, hostname, () => {
          watchFunc();
        });
        serverSocket.on('error', (e) => {
          console.log(err);
          process.exit(1);
        });
    } else {
      watchFunc();
    }
  });
} else {
  spinner.start();
  rollup.rollup(opt)
    .then(build => {
      spinner.stop();
      console.log(TAG, chalk.green('Electron build successed.'));
      build.write(opt.output);
    })
    .catch(error => {
      spinner.stop();
      console.log(`\n${TAG} ${chalk.red('Build Error')}\n`, error, '\n');
    });
}
