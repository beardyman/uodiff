#!/usr/bin/env node
'use strict';

const fs = require('fs');
const _ = require('lodash');
const chalk = require('chalk');
const argv = require('yargs')
  .usage('Usage: $0 fileA fileB [OPTIONS]')
  .alias('e', 'exclude')
  .describe('e', 'regex where if any portion of a matching line matches, that line will be excluded')
  .alias('w', 'whitespace')
  .boolean('w')
  .describe('w', 'trims the line and ignores whitespace before or after a line\'s content')
  .help()
  .argv;

let exclude;

if (typeof argv.e !== 'undefined') {
  exclude = new RegExp(argv.e);
}

let fileA = argv._[0];
let fileB = argv._[1];

fs.readFile(fileA, 'utf8', (err, data) => {
  let aContents = parseFile(fileA, data);
  fs.readFile(fileB, 'utf8', (err, data) => {
    let bContents = parseFile(fileB, data);

    reportResults(getDifference(aContents, bContents), fileA, fileB);
  });
});

function parseFile (file, data) {
  let r = [];
  _.forEach(data.split('\n'), (line, lineNumber) => {
    if (exclude === undefined || !line.match(exclude)) {
      if (argv.w){
        line = line.trim();
      }

      r.push({content: line, line: lineNumber + 1, file}) // offset 0 based index
    }
  });
  return r;
}

function getDifference (a, b){
  const diffa = _.differenceBy(a, b, 'content');
  const diffb = _.differenceBy(b, a, 'content');

  return _.orderBy(_.union(diffa, diffb), 'line');
}

function reportResults (diff, a, b) {
  console.log(chalk.red(`--- ${a}`));
  console.log(chalk.green(`+++ ${b}`));

  _.forEach(diff, (diffLine)=>{
    const maybePlus = diffLine.file === b;

    console.log(chalk[maybePlus ? 'green' : 'red'](`${diffLine.line} ${maybePlus ? '+' : '-'} ${diffLine.content}`));
  });
}