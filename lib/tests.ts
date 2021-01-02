import fs from 'fs';
import path from 'path';
import Parser from 'fast-xml-parser';
import { v4 } from 'uuid';

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
  '@_errors': string;
  '@_failures': string;
  '@_skipped': string;
  '@_timestamp': string;
  '@_time': string;
  '@_tests': string;
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

export const storeTestData = (content: string) => {
  const id = v4();
  fs.writeFileSync(
    path.join(testsDirectory, `junit-${id}.xml`),
    Buffer.from(content)
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
