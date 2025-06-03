import test from "tape";
import driveList from "../src/win32";

const stdout =
  "C:       Windows10IoT 57615052800  5809586176\r\n" +
  "D:       Data         69773291520 63910932480\r\n" +
  "E:       USBSTICK      8011120640  1031307264\r\n" +
  "F:                   478847647744 208413671424\r\n";

test("(Win32) replaceStdout", function (assert) {
  const replacedStdout = driveList.replaceStdout(stdout);

  assert.equals(replacedStdout.length, 4);
  assert.equals(replacedStdout[0][0], "C:");
  assert.equals(replacedStdout[2][1], "USBSTICK");
  assert.equals(replacedStdout[3][1], "");
  assert.end();
});

test("(Win32) test C", function (assert) {
  const replacedStdout = driveList.replaceStdout(stdout);
  const parsed = driveList.parse(replacedStdout[0]);

  assert.deepEquals(parsed, {
    total: 57615052800,
    used: 51805466624,
    available: 5809586176,
    percentageUsed: 90,
    mountpoint: "C:",
    name: "Windows10IoT",
  });
  assert.end();
});
test("(Win32) test D", function (assert) {
  const replacedStdout = driveList.replaceStdout(stdout);
  const parsed = driveList.parse(replacedStdout[1]);

  assert.deepEquals(parsed, {
    total: 69773291520,
    used: 5862359040,
    available: 63910932480,
    percentageUsed: 8,
    mountpoint: "D:",
    name: "Data",
  });
  assert.end();
});
test("(Win32) test E", function (assert) {
  const replacedStdout = driveList.replaceStdout(stdout);

  const parsed = driveList.parse(replacedStdout[2]);

  assert.deepEquals(parsed, {
    total: 8011120640,
    used: 6979813376,
    available: 1031307264,
    percentageUsed: 87,
    mountpoint: "E:",
    name: "USBSTICK",
  });
  assert.end();
});

test("(Win32) test F", function (assert) {
  const replacedStdout = driveList.replaceStdout(stdout);

  const parsed = driveList.parse(replacedStdout[3]);

  assert.deepEquals(parsed, {
    total: 478847647744,
    used: 270433976320,
    available: 208413671424,
    percentageUsed: 56,
    mountpoint: "F:",
    name: "",
  });
  assert.end();
});
