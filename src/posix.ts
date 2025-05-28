import { execFile } from "child_process";
import { DriveDataInterface } from "./Interfaces";

export const execDriveList = (cb: any) => {
  execFile("df", ["-P", "-k"], (err, stdout) => {
    if (err) {
      return err;
    }

    const lines = stdout.split("\n").filter((line: string) => line.length);

    lines.shift();

    const drives = lines.map((line: string) => parse(line.trim()));

    try {
      cb(null, drives);
    } catch (e) {
      cb(e);
    }
  });
};

export const parse = (driveLine: string): DriveDataInterface => {
  const matches = driveLine.match(
    /^(.+?)\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+%)\s+(.+)$/
  );

  if (!matches || matches.length !== 7) {
    throw new Error("Unexpected df output: [" + driveLine + "]");
  }

  // matches[1] is the filesystem name, e.g., /dev/disk1s1 or //server/share
  const total = Number(matches[2]);
  const used = Number(matches[3]);
  const available = Number(matches[4]);
  const percentageUsed = Number(matches[5].replace("%", ""));
  const mountpoint = matches[6].trim(); // Trim potential trailing spaces from mountpoint
  const name = mountpoint.split("/").pop();

  return {
    total: total * 1024,
    used: used * 1024,
    available: available * 1024,
    percentageUsed,
    mountpoint,
    name,
  };
};

module.exports = {
  execDriveList,
  parse,
};
