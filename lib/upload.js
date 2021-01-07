/* eslint-disable no-console */
const fs = require('fs');
const commander = require('commander');
const bent = require('bent');

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
  let buildInfo;
  if (process.env.CIRCLECI === 'true') {
    buildInfo = {
      'x-repository-url': process.env.CIRCLE_REPOSITORY_URL.replace(
        /^git@github.com:(.*)\.git$/,
        'https://github.com/$1/'
      ), // TODO: Reconsider including bitbucket
      'x-branch': process.env.CIRCLE_BRANCH,
      'x-commit-hash': process.env.CIRCLE_SHA1,
      'x-tag': process.env.CIRCLE_TAG,
      'x-pull-request-url': process.env.CIRCLE_PULL_REQUEST, // TODO: might be better to accept multiple urls, process.env.CIRCLE_PULL_REQUESTS.split(','),
      'x-build-rl': process.env.CIRCLE_BUILD_URL,
    };
  } else if (process.env.MOCKCI === 'true') {
    buildInfo = {
      'x-repository-url': 'https://github.com/aha-oretama/testerve-ui',
      'x-branch': 'main',
      'x-commit-hash': '3e39d5a0c3aa3bb6ffba1cbe8fde0858fe93b851',
      'x-tag': undefined,
      'x-pull-request-url': undefined,
      'x-build-rl': 'https://circleci.com/gh/aha-oretama/reportstore-ui/22',
    };
  }
  Object.keys(buildInfo).forEach(
    (key) => !buildInfo[key] && delete buildInfo[key]
  );
  return buildInfo;
};

const testCommand = async () => {
  commander.parse(process.argv);

  const [filePath] = commander.args;
  if (!fs.existsSync(filePath)) {
    console.log('file not exist,', filePath);
    return 1;
  }
  try {
    // TODO: Expected codes are https://github.com/aha-oretama/testerve-ui/blob/be29e03b9a89d7890822a6f319bdcf5874b9ba27/lib/upload.js#L49-L62
    // However, Vercel is running in lambda in AWS.
    // When posting FormData with file upload, server api always failed in parsing the body.
    // Related discussion, https://github.com/vercel/next.js/discussions/11634#discussioncomment-143941
    const data = fs.readFileSync(filePath);
    const post = bent(commander.url, 'POST');
    const response = await post('api/tests', data, {
      'Content-Disposition': 'attachment; name="data"; filename="data"',
      'Content-Type': 'image/jpeg',
      'Content-Length': data.length,
      ...getBuildInfo(),
    });

    if (response.status === 200) {
      console.log('Successfully uploaded!');
      return 0;
    } else {
      console.log(`Response status is ${response.status}`, response);
      return 1;
    }
  } catch (e) {
    console.log(e);
    return 1;
  }
};

module.exports = testCommand;
