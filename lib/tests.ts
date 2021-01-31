import Parser from 'fast-xml-parser';
import db from '../models';
import { DateTime } from 'luxon';
import {Transactionable} from "sequelize";

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

export interface BuildInfo {
  reportId: number;
  repositoryUrl: string;
  branch: string;
  commitHash: string;
  tag?: string;
  pullRequestUrl?: string; // TODO: might be better to accept multiple urls, process.env.CIRCLE_PULL_REQUESTS.split(','),
  buildUrl: string;
}

export async function getSortedTestsData() {
  return await db.report.findAll({
    include: db.report.associations.build,
    order: [['id', 'DESC']],
  });
}

export const getTestData = async (id) => {
  return await db.report.findByPk(id, {
    rejectOnEmpty: true,
    include: [
      {
        association: db.report.associations.suites,
        include: [
          {
            association: db.suite.associations.testcases,
          },
        ],
      },
    ],
  });
};

export const storeBuildInfo = async (build: BuildInfo, transactionable: Transactionable = {}) => {
  return await db.build.create({
    report_id: build.reportId,
    repository_url: build.repositoryUrl,
    branch: build.branch,
    commit_hash: build.commitHash,
    tag: build.tag,
    pull_request_url: build.pullRequestUrl,
    build_url: build.buildUrl,
  }, transactionable);
};

export const storeTestData = async (
  repositoryId: number,
  rawContent: string,
  transactionable: Transactionable  = {}
) => {
  const content = Parser.parse(rawContent, { ignoreAttributes: false });
  const { testsuites } = formatJunitContent(content);

  const report = await db.report.create({
    name: testsuites['@_name'],
    repository_id: repositoryId,
    tests: Number(testsuites['@_tests']),
    failures: Number(testsuites['@_failures']),
    errors: Number(testsuites['@_errors']),
    time: Number(testsuites['@_time']),
  }, transactionable);
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
        timestamp: DateTime.fromISO(suite['@_timestamp'], {
          zone: 'utc',
        }).toJSDate(),
      }, transactionable);
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
            }, transactionable)
        )
      );
    })
  );

  return report;
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
