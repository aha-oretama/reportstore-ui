import {
  getSortedTestsData,
  getTestData,
  storeBuildInfo,
  storeTestData,
} from '../../lib/tests';
import path from 'path';
import db from '../../models';
import fs from 'fs';
import { DateTime } from 'luxon';
import { storeToken } from '../../lib/tokens';

const dataDir = path.join(__dirname, '..', 'data');
let report;
let build;

const getFileContent = (fileName: string) =>
  fs.readFileSync(path.join(dataDir, fileName), 'utf8');
const notFoundRepositoryId = 110;
const repositoryId = 111;

beforeAll(async () => {
  const transaction = await db.sequelize.transaction();
  try {
    await storeToken(repositoryId, { transaction });
    // To fix the order, don't use Promise.all
    report = await storeTestData(
      repositoryId,
      getFileContent('junit-pass.xml'),
      { transaction }
    );
    build = await storeBuildInfo(
      {
        reportId: report.id,
        repositoryUrl: 'https://github.com/aha-oretama/testerve-ui',
        branch: 'main',
        commitHash: '3e39d5a0c3aa3bb6ffba1cbe8fde0858fe93b851',
        buildUrl: 'https://circleci.com/gh/aha-oretama/reportstore-ui/22',
      },
      { transaction }
    );
    await storeTestData(repositoryId, getFileContent('junit-fail.xml'), {
      transaction,
    });
    await storeTestData(repositoryId, getFileContent('junit-fail-skip.xml'), {
      transaction,
    });

    await transaction.commit();
  } catch (e) {
    await transaction.rollback();
    console.error(e);
  }
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
  it('getSortedTestsData return empty array when the condition does not match', async () => {
    const testsData = await getSortedTestsData(notFoundRepositoryId);
    expect(testsData).toHaveLength(0);
  });

  it('getSortedTestsData returns three data, and sorted by id desc', async () => {
    const testsData = await getSortedTestsData(repositoryId);
    expect(testsData).toHaveLength(3);
    expect(testsData[0].id).toBeGreaterThan(testsData[1].id);
    expect(testsData[1].id).toBeGreaterThan(testsData[2].id);
  });

  it('getSortedTestsData returns build information', async () => {
    const testsData = await getSortedTestsData(repositoryId);
    expect(testsData[2].build).toBeDefined(); // first data should be junit-pass.xml
    expect(testsData[2].build.commit_hash).toBe(
      '3e39d5a0c3aa3bb6ffba1cbe8fde0858fe93b851'
    );
  });

  it('getTestData returns the report, suites, testcases', async () => {
    const testsData = await getSortedTestsData(repositoryId);
    const testData = await getTestData(testsData[2].id); // first data should be junit-pass.xml
    expect(testData.name).toBe('jest tests');
    expect(testData.time).toBe(9.681);
    expect(testData.suites[0].name).toBe('post.test.ts');
    expect(testData.suites[0].timestamp).toEqual(
      DateTime.fromISO('2020-12-31T14:19:22.000Z').toJSDate()
    );
    expect(testData.suites[0].testcases[0].name).toBe(
      'getAllPostIds should return ids'
    );
  });
});

afterAll(async () => {
  await db.integration.destroy({
    truncate: true,
    cascade: true,
  });
  db.sequelize.close();
});
