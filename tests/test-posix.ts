import test from "tape";
import driveList from "../dist/posix";

test("(POSIX) it parses Debian output", (assert) => {
  //'Filesystem               1K-blocks      Used Available Use% Mounted on\n'
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

test("(POSIX) it parses non-ascii output", function (assert) {
  // 'Файловая система 1K-блоков Использовано Доступно Использовано% Cмонтировано в\n' +
  const output =
    "/dev/simfs       228969916    152855096 64477156           71% /\n";
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
  // 'Filesystem           1024-blocks    Used Available Capacity Mounted on\n' +
  const output =
    "10.100.1.1:/mnt/hdd2/k8s/test-pvc-2dab28c8-d3b1-432d-bd9a-78445438618a                                                                  3844640768 1929825280 1719448576  53% /\n";
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
  // 'Filesystem                      1024-blocks        Used  Available Capacity Mounted on\n' +
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
  //'Filesystem 1024-blocks     Used Available Capacity  iused   ifree %iused  Mounted on\n' +
  const output = "/dev/disk1   117286A12 98815836";
  try {
    driveList.parse(output);
  } catch (e) {
    assert.true(!!e);
  }
  assert.end();
});

test("(POSIX) it not parses if output is mallformed (III)", function (assert) {
  // 'Filesystem 1024-blocks     Used Available Capacity  iused   ifree %iused  Mounted on\n' +
  const output =
    "/dev/disk1   117286A12 98815836  18215076    85% 24767957 4553769   84%   /\n";
  try {
    driveList.parse(output);
  } catch (e) {
    assert.true(!!e);
  }
  assert.end();
});
