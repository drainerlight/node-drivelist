import { execFile } from "child_process";
import { DriveDataInterface } from "./Interfaces";

export type DriveListCallback = (
  err: Error | null,
  drives?: DriveDataInterface[]
) => void;

export const execDriveList = (cb: DriveListCallback) => {
  execFile("df", ["-P", "-k"], (err, stdout) => {
    if (err) {
      return cb(err);
    }

    try {
      const lines = stdout.split("\n").filter((line: string) => line.length);
      lines.shift();

      const drives = lines.map((line: string) => parse(line.trim()));
      cb(null, drives);
    } catch (e: any) {
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
  const cleanMountpoint =
    mountpoint === "/" ? "/" : mountpoint.replace(/\/+$/, "");
  const name =
    cleanMountpoint === "/" ? "" : cleanMountpoint.split("/").pop() || "";

  return {
    total: total * 1024,
    used: used * 1024,
    available: available * 1024,
    percentageUsed,
    mountpoint,
    name,
  };
};

export default {
  execDriveList,
  parse,
};
