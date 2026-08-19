import { exec } from "child_process";
import { DriveDataInterface } from "./Interfaces";

export type DriveListCallback = (
  err: Error | null,
  drives?: DriveDataInterface[]
) => void;

export const execDriveList = (cb: DriveListCallback) => {
  exec(
    'powershell -Command "Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, VolumeName, Size, FreeSpace | Format-Table -HideTableHeaders"',
    { windowsHide: true },
    (err, stdout) => {
      if (err) {
        return cb(err);
      }

      try {
        const lines = replaceStdout(stdout);
        const drives = lines.map((line: string[]) => parse(line));
        cb(null, drives);
      } catch (e: any) {
        cb(e);
      }
    }
  );
};

export const replaceStdout = (stdout: string): string[][] => {
  return stdout
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line: string) => line.trim().length)
    .map((line: string) => {
      const match = line.match(/^(\w:)\s*(.*?)\s+(\d+)\s+(\d+)$/);
      if (match) {
        return [match[1], match[2].trim(), match[3], match[4]];
      }
      return [];
    })
    .filter((parts: string[]) => parts.length > 0);
};

export const parse = (line: string[]): DriveDataInterface => {
  const mountpoint = line[0];
  const name = line[1];
  const total = Number(line[2]);
  const available = Number(line[3]);
  const used = total - available;
  const percentageUsed = total > 0 ? Math.round((used / total) * 100) : 0;

  return {
    total,
    used,
    available,
    percentageUsed,
    mountpoint,
    name,
  };
};

export default {
  execDriveList,
  parse,
  replaceStdout,
};
