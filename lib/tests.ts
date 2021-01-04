import fs from 'fs';
import path from 'path';
import Parser from 'fast-xml-parser';
import db from '../models';

const testsDirectory = path.join(process.cwd(), 'data', 'tests');

interface JunitTestcase {
  '@_classname': string;
  '@_name': string;
  '@_time': string;
  failure?: string;
  skipped?: '';
}

interface JunitTestsuite {
  '@_name': string;
  '@_tests': string;
  '@_failures': string;
  '@_errors': string;
  '@_skipped': string;
  '@_time': string;
  '@_timestamp': string;
  testcase: JunitTestcase[];
}

interface JunitContent {
  testsuites: {
    '@_name': string;
    '@_tests': string;
    '@_failures': string;
    '@_errors': string;
    '@_time': string;
    testsuite: JunitTestsuite[];
  };
}

export function getSortedTestsData() {
  const fileNames = fs.readdirSync(testsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/^junit-/, '').replace(/\.xml$/, '');

    const filePath = path.join(testsDirectory, fileName);
    const time = fs.statSync(filePath).mtime.getTime();

    return {
      id,
      time,
    };
  });
  // Sort by date in descending order
  return allPostsData.sort((a, b) => {
    if (a.time < b.time) {
      return 1;
    } else {
      return -1;
    }
  });
}

export const getAllTestIds = () => {
  const fileNames = fs.readdirSync(testsDirectory);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/^junit-/, '').replace(/\.xml$/, ''),
      },
    };
  });
};

export const getTestData = (id) => {
  const filePath = path.join(testsDirectory, `junit-${id}.xml`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const time = fs.statSync(filePath).mtime.getTime();
  const content = Parser.parse(fileContents, { ignoreAttributes: false });

  return {
    id,
    time,
    ...formatJunitContent(content),
  };
};

export const storeTestData = async (rawContent: string) => {
  const content = Parser.parse(rawContent, { ignoreAttributes: false });
  const { testsuites } = formatJunitContent(content);

  const report = await db.report.create({
    name: testsuites['@_name'],
    tests: Number(testsuites['@_tests']),
    failures: Number(testsuites['@_failures']),
    errors: Number(testsuites['@_errors']),
    time: Number(testsuites['@_time']),
  });
  await Promise.all(
    testsuites.testsuite.map(async (suite) => {
      const suiteRecord = await db.suite.create({
        report_id: report.id,
        name: suite['@_name'],
        tests: Number(suite['@_tests']),
        failures: Number(suite['@_failures']),
        errors: Number(suite['@_errors']),
        skipped: Number(suite['@_skipped']),
        time: Number(suite['@_time']),
        timestamp: suite['@_timestamp'].replace(/T/, ' '),
      });
      await Promise.all(
        suite.testcase.map(
          async (test) =>
            await db.testcase.create({
              suite_id: suiteRecord.id,
              classname: test['@_classname'],
              name: test['@_name'],
              failure: test.failure,
              skipped: test.skipped,
              time: Number(test['@_time']),
            })
        )
      );
    })
  );
};

const formatJunitContent = (content: any): JunitContent => {
  const tmpSuite = content.testsuites.testsuite;
  const testsuite = Array.isArray(tmpSuite) ? tmpSuite : [tmpSuite];
  // testcase should always return array
  testsuite.forEach((s) => {
    s.testcase = Array.isArray(s.testcase) ? s.testcase : [s.testcase];
  });
  // testsuite should always return array
  content.testsuites.testsuite = testsuite;
  return content;
};
