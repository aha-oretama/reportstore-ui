import {
  getSortedTestsData,
  getTestData,
  storeBuildInfo,
  storeTestData,
} from '../../lib/tests';
import path from 'path';
import db from '../../models';
import fs from 'fs';

const dataDir = path.join(__dirname, '..', 'data');
let report;
let build;

beforeAll(async () => {
  const getFileContent = (fileName: string) =>
    fs.readFileSync(path.join(dataDir, fileName), 'utf8');
  // To fix the order, don't use Promise.all
  report = await storeTestData(getFileContent('junit-pass.xml'));
  build = await storeBuildInfo({
    reportId: report.id,
    repositoryUrl: 'https://github.com/aha-oretama/testerve-ui',
    branch: 'main',
    commitHash: '3e39d5a0c3aa3bb6ffba1cbe8fde0858fe93b851',
    buildUrl: 'https://circleci.com/gh/aha-oretama/reportstore-ui/22',
  });
  await storeTestData(getFileContent('junit-fail.xml'));
  await storeTestData(getFileContent('junit-fail-skip.xml'));
});

describe('Build', () => {
  it('storeBuildInfo should register', async () => {
    const record = await db.build.findByPk(build.id);
    expect(record.repository_url).toBe(
      'https://github.com/aha-oretama/testerve-ui'
    );
    expect(record.branch).toBe('main');
    expect(record.commit_hash).toBe('3e39d5a0c3aa3bb6ffba1cbe8fde0858fe93b851');
    expect(record.build_url).toBe(
      'https://circleci.com/gh/aha-oretama/reportstore-ui/22'
    );
    expect(record.tag).toBeNull();
    expect(record.pull_request_url).toBeNull();
  });
});

describe('TestData', () => {
  it('getSortedTestsData returns three data, and sorted by id desc', async () => {
    const testsData = await getSortedTestsData();
    expect(testsData).toHaveLength(3);
    expect(testsData[0].id).toBeGreaterThan(testsData[1].id);
    expect(testsData[1].id).toBeGreaterThan(testsData[2].id);
  });

  it('getSortedTestsData returns build information', async () => {
    const testsData = await getSortedTestsData();
    expect(testsData[2].build).toBeDefined(); // first data should be junit-pass.xml
    expect(testsData[2].build.commit_hash).toBe(
      '3e39d5a0c3aa3bb6ffba1cbe8fde0858fe93b851'
    );
  });

  it('getTestData returns the report, suites, testcases', async () => {
    const testsData = await getSortedTestsData();
    const testData = await getTestData(testsData[2].id); // first data should be junit-pass.xml
    expect(testData.name).toBe('jest tests');
    expect(testData.time).toBe(9.681);
    expect(testData.suites[0].name).toBe('post.test.ts');
    expect(testData.suites[0].testcases[0].name).toBe(
      'getAllPostIds should return ids'
    );
  });
});

afterAll(async () => {
  await db.report.destroy({
    truncate: { cascade: true },
  });
  db.sequelize.close();
});
