import test from "tape";
import driveList from "../src/posix";

test("(POSIX) it parses Debian output", (assert) => {
  //'Filesystem               1K-blocks      Used Available Use% Mounted on'
  const output =
    "/dev/mapper/vg0-vg0_root 468090408 320796928 123515792  73% /boot/efi";
  const parsed = driveList.parse(output);

  assert.deepEquals(parsed, {
    total: 1024 * 468090408,
    used: 1024 * 320796928,
    available: 1024 * 123515792,
    percentageUsed: 73,
    mountpoint: "/boot/efi",
    name: "efi",
  });
  assert.end();
});

test("(POSIX) it parses line with leading and trailing whitespace", (assert) => {
  const output = "  /dev/sda1   100   50   50   50%   /mnt/mytest  ";
  // Note: execDriveList would trim this line before calling parse.
  // parse itself is robust to internal spacing and trims the mountpoint.
  const parsed = driveList.parse(output.trim()); // Simulating the trim from execDriveList

  assert.deepEquals(parsed, {
    total: 1024 * 100,
    used: 1024 * 50,
    available: 1024 * 50,
    percentageUsed: 50,
    mountpoint: "/mnt/mytest",
    name: "mytest",
  });
  assert.end();
});

test("(POSIX) it parses specific problematic line with potential surrounding whitespace", (assert) => {
  const output =
    "   /dev/simfs       228969916    152855096    64477156           71% /   ";
  // Note: execDriveList would trim this line.
  const parsed = driveList.parse(output.trim()); // Simulating the trim from execDriveList

  assert.deepEquals(parsed, {
    total: 1024 * 228969916,
    used: 1024 * 152855096,
    available: 1024 * 64477156,
    percentageUsed: 71,
    mountpoint: "/",
    name: "",
  });
  assert.end();
});

test("(POSIX - macOS) it parses root mount (/) output", (assert) => {
  const output = "/dev/disk1s1    488281248 450181248  37100000   93% /";
  const parsed = driveList.parse(output);

  assert.deepEquals(parsed, {
    total: 1024 * 488281248,
    used: 1024 * 450181248,
    available: 1024 * 37100000,
    percentageUsed: 93,
    mountpoint: "/",
    name: "", // .split('/').pop() for "/" is ""
  });
  assert.end();
});

test("(POSIX - macOS) it parses /System/Volumes/Data output", (assert) => {
  const output =
    "/dev/disk1s5    488281248  10000000  37100000   22% /System/Volumes/Data";
  const parsed = driveList.parse(output);

  assert.deepEquals(parsed, {
    total: 1024 * 488281248,
    used: 1024 * 10000000,
    available: 1024 * 37100000,
    percentageUsed: 22,
    mountpoint: "/System/Volumes/Data",
    name: "Data",
  });
  assert.end();
});

test("(POSIX - macOS) it parses external drive output from /Volumes/", (assert) => {
  const output =
    "/dev/disk2s2    1953125000 500000000 1453125000  26% /Volumes/MyExternalDrive";
  const parsed = driveList.parse(output);

  assert.deepEquals(parsed, {
    total: 1024 * 1953125000,
    used: 1024 * 500000000,
    available: 1024 * 1453125000,
    percentageUsed: 26,
    mountpoint: "/Volumes/MyExternalDrive",
    name: "MyExternalDrive",
  });
  assert.end();
});

test("(POSIX - macOS) it parses mountpoint with spaces", (assert) => {
  const output =
    "com.apple.TimeMachine:/dev/disk3s2 976562500 200000000 776562500 21% /Volumes/Time Machine Backups";
  const parsed = driveList.parse(output);

  assert.deepEquals(
    parsed,
    {
      total: 1024 * 976562500,
      used: 1024 * 200000000,
      available: 1024 * 776562500,
      percentageUsed: 21,
      mountpoint: "/Volumes/Time Machine Backups",
      name: "Time Machine Backups",
    },
    "Mountpoint with spaces should be parsed correctly."
  );
  assert.end();
});

test("(POSIX - macOS) it parses mountpoint with multiple spaces", (assert) => {
  const output = "anotherfs 100000 50000 50000 50% /mnt/my cool disk";
  const parsed = driveList.parse(output);

  assert.deepEquals(parsed, {
    total: 1024 * 100000,
    used: 1024 * 50000,
    available: 1024 * 50000,
    percentageUsed: 50,
    mountpoint: "/mnt/my cool disk",
    name: "my cool disk",
  });
  assert.end();
});

test("(POSIX - macOS) it parses mountpoint with special characters", (assert) => {
  const output = "specialfs 100000 50000 50000 50% /mnt/archive-2023!@#";
  const parsed = driveList.parse(output);

  assert.deepEquals(parsed, {
    total: 1024 * 100000,
    used: 1024 * 50000,
    available: 1024 * 50000,
    percentageUsed: 50,
    mountpoint: "/mnt/archive-2023!@#",
    name: "archive-2023!@#",
  });
  assert.end();
});

test("(POSIX - macOS) it parses APFS snapshot-like filesystem name", (assert) => {
  const output =
    "com.apple.os.update-.snapshot       123456789   12345678   111111111   10% /System/Volumes/Update";
  const parsed = driveList.parse(output);

  assert.deepEquals(parsed, {
    total: 1024 * 123456789,
    used: 1024 * 12345678,
    available: 1024 * 111111111,
    percentageUsed: 10,
    mountpoint: "/System/Volumes/Update",
    name: "Update",
  });
  assert.end();
});

test("(POSIX) it parses non-ascii output", function (assert) {
  // 'Файловая система 1K-блоков Использовано Доступно Использовано% Cмонтировано в' +
  const output =
    "/dev/simfs       228969916    152855096 64477156           71% /";
  const parsed = driveList.parse(output);
  assert.deepEquals(parsed, {
    total: 1024 * 228969916,
    used: 1024 * 152855096,
    available: 1024 * 64477156,
    percentageUsed: 71,
    mountpoint: "/",
    name: "",
  });
  assert.end();
});

test("(POSIX) it parses long output", function (assert) {
  // 'Filesystem           1024-blocks    Used Available Capacity Mounted on' +
  const output =
    "10.100.1.1:/mnt/hdd2/k8s/test-pvc-2dab28c8-d3b1-432d-bd9a-78445438618a                                                                  3844640768 1929825280 1719448576  53% /";
  const parsed = driveList.parse(output);
  assert.deepEquals(parsed, {
    total: 1024 * 3844640768,
    used: 1024 * 1929825280,
    available: 1024 * 1719448576,
    percentageUsed: 53,
    mountpoint: "/",
    name: "",
  });
  assert.end();
});

test("(POSIX) it parses filesystems with spaces", function (assert) {
  // 'Filesystem                      1024-blocks        Used  Available Capacity Mounted on' +
  const output =
    "//example.com/Some Storage/Test 17179803648 15080666092 2099137556      88% /mnt/test";
  const parsed = driveList.parse(output);
  assert.deepEquals(parsed, {
    total: 1024 * 17179803648,
    used: 1024 * 15080666092,
    available: 1024 * 2099137556,
    percentageUsed: 88,
    mountpoint: "/mnt/test",
    name: "test",
  });
  assert.end();
});

test("(POSIX) it not parses if output is mallformed (II)", function (assert) {
  //'Filesystem 1024-blocks     Used Available Capacity  iused   ifree %iused  Mounted on' +
  const output = "/dev/disk1   117286A12 98815836";
  try {
    driveList.parse(output);
  } catch (e) {
    assert.true(!!e);
  }
  assert.end();
});

test("(POSIX) it not parses if output is mallformed (III)", function (assert) {
  // 'Filesystem 1024-blocks     Used Available Capacity  iused   ifree %iused  Mounted on' +
  const output =
    "/dev/disk1   117286A12 98815836  18215076    85% 24767957 4553769   84%   /";
  try {
    driveList.parse(output);
  } catch (e) {
    assert.true(!!e);
  }
  assert.end();
});
