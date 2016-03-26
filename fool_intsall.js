#!/usr/bin/env node

'use strict';

var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var spawn = require('child_process').spawn;

var CLI_MODULE_PATH = function() {
  return path.resolve(
    process.cwd(),
    'node_modules',
    'react-native',
    'cli.js'
  );
};

var REACT_NATIVE_PACKAGE_JSON_PATH = function() {
  return path.resolve(
    process.cwd(),
    'node_modules',
    'react-native',
    'package.json'
  );
};

var cli;
var cliPath = CLI_MODULE_PATH();
if (fs.existsSync(cliPath)) {
  cli = require(cliPath);
}

init();

function init() {
  var root = process.cwd();
  var projectName = path.basename(root);

  validatePackageName(projectName);
  createProject(root, projectName);
}

function validatePackageName(name) {
  if (!name.match(/^[$A-Z_][0-9A-Z_$]*$/i)) {
    console.error(
      '"%s" is not a valid name for a project. Please use a valid identifier ' +
        'name (alphanumeric).',
      name
    );
    process.exit(1);
  }

  if (name === 'React') {
    console.error(
      '"%s" is not a valid name for a project. Please do not use the ' +
        'reserved word "React".',
      name
    );
    process.exit(1);
  }
}

function createProject(root, projectName) {

  console.log(
    'This will walk you through creating a new React Native project in',
    root
  );

  var packageJson = {
    name: projectName,
    version: '0.0.1',
    private: true,
    scripts: {
      start: 'node node_modules/react-native/local-cli/cli.js start'
    }
  };
  fs.writeFileSync(path.join(root, 'package.json'), JSON.stringify(packageJson));

  console.log('Installing react-native package from npm...');
  run(root, projectName);
}

function run(root, projectName) {
  exec('ls', function(e, stdout, stderr) {
    if (e) {
      console.log(stdout);
      console.error(stderr);
      console.error('`npm install --save react-native` failed');
      process.exit(1);
    }

    var cli = require(CLI_MODULE_PATH());
    cli.init(root, projectName);
  });
}