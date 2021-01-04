import {
  getSortedTestsData,
  getTestData,
  storeTestData,
} from '../../lib/tests';
import fs from 'fs';
import path from 'path';
import db from '../../models';

const dataDir = path.join(__dirname, '..', 'data');
const files = ['junit-pass.xml', 'junit-fail.xml', 'junit-fail-skip.xml'];

beforeAll(async () => {
  // To fix the order, don't use Promise.all
  for (const file of files) {
    const fileContent = fs.readFileSync(path.join(dataDir, file), 'utf8');
    await storeTestData(fileContent);
  }
});

it('getSortedTestsData returns three data, and sorted by id desc', async () => {
  const testsData = await getSortedTestsData();
  expect(testsData).toHaveLength(3);
  expect(testsData[0].id).toBeGreaterThan(testsData[1].id);
  expect(testsData[1].id).toBeGreaterThan(testsData[2].id);
});

it('getTestData returns the specific data', async () => {
  const testsData = await getSortedTestsData();
  const passData = await getTestData(testsData[2].id); // first data should be junit-pass.xml
  expect(passData.name).toBe('jest tests');
  expect(passData.time).toBe(9.681);
  expect(passData.suites[0].name).toBe('post.test.ts');
  expect(passData.suites[0].testcases[0].name).toBe(
    'getAllPostIds should return ids'
  );
});

afterAll(async () => {
  await db.report.destroy({
    truncate: { cascade: true },
  });
  db.sequelize.close();
});
