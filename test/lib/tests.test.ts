import {getSortedTestsData} from "../../lib/tests";

it("getSortedTestsData should return id and testsuites", () => {
  const tests = getSortedTestsData();
  expect(tests).toHaveLength(3);
  expect(tests[0].time > tests[1].time).toBeTruthy();
  expect(tests[0].testsuites["@_name"]).toBeDefined();
})
