import {
  getAllTestIds,
  getSortedTestsData,
  getTestData,
} from '../../lib/tests';

it('getSortedTestsData should return id and time. ', () => {
  const tests = getSortedTestsData();
  expect(tests.length).toBeGreaterThan(0);
  expect(tests[0].time > tests[1].time).toBeTruthy();
});

it('getAllTestIds should return ids', () => {
  const ids = getAllTestIds();
  expect(ids.length).toBeGreaterThan(0);
  expect(ids[0].params.id).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
  );
});

it('getTestData should return testsuiretes. testsuite and testcase should be array', () => {
  const testData = getTestData('d7cf3960-4c0d-11eb-82e9-35e1a462a88a');
  expect(testData.testsuites['@_name']).toBeDefined();
  expect(Array.isArray(testData.testsuites.testsuite)).toBeTruthy();
  expect(Array.isArray(testData.testsuites.testsuite[0].testcase)).toBeTruthy();
});
