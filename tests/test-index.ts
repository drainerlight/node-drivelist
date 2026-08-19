import test from "tape";
import { getDriveList, getDriveByName } from "../src/index";

test("(Index) getDriveList retrieves drives array", async (assert) => {
  try {
    const drives = await getDriveList();
    assert.ok(Array.isArray(drives), "getDriveList returns an array");
    if (drives.length > 0) {
      const first = drives[0];
      assert.equals(
        typeof first.mountpoint,
        "string",
        "mountpoint should be string"
      );
      assert.equals(
        typeof first.total,
        "number",
        "total space should be number"
      );
      assert.equals(
        typeof first.available,
        "number",
        "available space should be number"
      );
      assert.equals(typeof first.used, "number", "used space should be number");
      assert.equals(
        typeof first.percentageUsed,
        "number",
        "percentageUsed should be number"
      );
      assert.equals(typeof first.name, "string", "name should be string");
    }
  } catch (err) {
    assert.error(
      err as Error,
      "getDriveList should not throw unexpected error"
    );
  }
  assert.end();
});

test("(Index) getDriveByName returns null when drive not found", async (assert) => {
  try {
    const drive = await getDriveByName("__non_existent_drive_12345__");
    assert.equals(drive, null, "should return null for non existent drive");
  } catch (err) {
    assert.error(err as Error, "getDriveByName should not throw");
  }
  assert.end();
});
