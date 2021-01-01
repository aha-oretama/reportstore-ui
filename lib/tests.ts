import fs from 'fs';
import path from 'path';
import Parser from 'fast-xml-parser';

const testsDirectory = path.join(process.cwd(), 'data', 'tests');

interface JunitContent {
  testsuites: {
    '@_name': string;
    '@_tests': string;
    '@_failures': string;
    '@_errors': string;
    '@_time': string;
    testsuite: [
      {
        '@_name': string;
        '@_errors': string;
        '@_failures': string;
        '@_skipped': string;
        '@_timestamp': string;
        '@_time': string;
        '@_tests': string;
        testcase: {
          '@_classname': string;
          '@_name': string;
          '@_tests': string;
        };
      }
    ];
  };
}

export function getSortedTestsData() {
  const fileNames = fs.readdirSync(testsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/^junit-/, '').replace(/\.xml$/, '');

    const fullPath = path.join(testsDirectory, fileName);
    const time = fs.statSync(fullPath).mtime.getTime();
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const content = Parser.parse(fileContents, { ignoreAttributes: false });

    return {
      id,
      time,
      ...(content as JunitContent),
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
