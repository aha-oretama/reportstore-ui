/* eslint-disable no-console */
const fs = require('fs');
const commander = require('commander');
const fetch = require('node-fetch');
const FormData = require('form-data');
const path = require("path");

commander.option('-t, --token <token>', 'Api token: TODO');
commander.option(
  '-u, --url <token>',
  'testerve base url',
  'http://localhost:3000/'
);
commander
  .usage('[options] <filepath>')
  .description('upload the file of test results');

const getBuildInfo = () => {
  // CircleCI
  if (process.env.CIRCLECI === 'true') {
    return {
      repositoryUrl: process.env.CIRCLE_REPOSITORY_URL,
      branch: process.env.CIRCLE_BRANCH,
      commitHash: process.env.CIRCLE_SHA1,
      tag: process.env.CIRCLE_TAG,
      pullRequestUrl: process.env.CIRCLE_PULL_REQUEST, // TODO: might be better to accept multiple urls, process.env.CIRCLE_PULL_REQUESTS.split(','),
      buildUrl: process.env.CIRCLE_BUILD_URL,
    };
  } else if (process.env.MOCKCI === 'true') {
    return {
      repositoryUrl: 'https://github.com/aha-oretama/testerve-ui',
      branch: 'main',
      commitHash: '3e39d5a0c3aa3bb6ffba1cbe8fde0858fe93b851',
      tag: null,
      pullRequestUrl: null,
      buildUrl: 'https://circleci.com/gh/aha-oretama/reportstore-ui/22',
    };
  }
};

const testCommand = async () => {
  commander.parse(process.argv);

  const [filePath] = commander.args;
  if (!fs.existsSync(filePath)) {
    console.log('file not exist,', filePath);
    return 1;
  }
  try {
    const form = new FormData({uploadDir: '/tmp'});
    const data = fs.createReadStream(filePath, { encoding: 'utf8' });
    form.append('file', data, {
      filename: path.basename(filePath),
      contentType: 'application/xml',
      knownLength: data.length,
    });
    const buildInfo = getBuildInfo();
    Object.keys(buildInfo)
      .filter((key) => !!buildInfo[key])
      .forEach((key) => {
        form.append(key, buildInfo[key]);
      });

    const response = await fetch(`${commander.url}api/tests`, {
      method: 'POST',
      body: form,
    });

    if (response.status === 200) {
      console.log('Successfully uploaded!');
      return 0;
    } else {
      console.log(`${response.status} response`, response);
      return 1;
    }
  } catch (e) {
    console.log(e);
    return 1;
  }
};

module.exports = testCommand;
