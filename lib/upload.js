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

const testCommand = async () => {
  commander.parse(process.argv);

  const [filePath] = commander.args;
  if (!fs.existsSync(filePath)) {
    console.log('file not exist,', filePath);
    return 1;
  }
  try {
    const data = fs.readFileSync(filePath);
    const post = bent(commander.url, 'POST');
    const response = await post('api/tests', data, {
      'Content-Disposition': 'attachment; name="data"; filename="data"',
      'Content-Type': 'image/jpeg',
      'Content-Length': data.length,
    });
    if (response.status === 200) {
      console.log('Successfully uploaded!');
      return 0;
    } else {
      return 1;
    }
  } catch (e) {
    console.log(e);
    return 1;
  }
};

module.exports = testCommand;
