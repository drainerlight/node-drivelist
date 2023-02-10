const test = require("tape");

const driveList = require("../dist/win32");

const stdout =
  "FreeSpace     Name  Size         VolumeName \r\r\n" +
  "455402688512  C:    998659936256  \r\r\n" +
  "0             D:    606087168     \r\r\n" +
  "              E:                  \r\r\n" +
  "455402688512  F:    998659936256  TestName\r\r\n";

test("(Win32) replaceStdout", function (assert) {
  const replacedStdout = driveList.replaceStdout(stdout);

  assert.equals(replacedStdout.length, 3);
  assert.equals(replacedStdout[0][0], "455402688512");
  assert.equals(replacedStdout[2][3], "TestName");
  assert.end();
});

test("(Win32) test C", function (assert) {
  const replacedStdout = driveList.replaceStdout(stdout);
  const parsed = driveList.parse(replacedStdout[0]);

  assert.deepEquals(parsed, {
    total: 998659936256,
    used: 543257247744,
    available: 455402688512,
    percentageUsed: 54,
    mountpoint: "C:",
    name: undefined,
  });
  assert.end();
});
test("(Win32) test D", function (assert) {
  const replacedStdout = driveList.replaceStdout(stdout);
  const parsed = driveList.parse(replacedStdout[1]);

  assert.deepEquals(parsed, {
    total: 606087168,
    used: 606087168,
    available: 0,
    percentageUsed: 100,
    mountpoint: "D:",
    name: undefined,
  });
  assert.end();
});
test("(Win32) test F", function (assert) {
  const replacedStdout = driveList.replaceStdout(stdout);

  const parsed = driveList.parse(replacedStdout[2]);

  assert.deepEquals(parsed, {
    total: 998659936256,
    used: 543257247744,
    available: 455402688512,
    percentageUsed: 54,
    mountpoint: "F:",
    name: "TestName",
  });
  assert.end();
});
