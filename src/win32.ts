import { exec } from "child_process";
import { DriveDataInterface } from "./Interfaces";

export const execDriveList = (cb: any) => {
  exec(
    'powershell -Command "Get-CimInstance Win32_LogicalDisk | Select-Object DeviceID, VolumeName, Size, FreeSpace | Format-Table -HideTableHeaders"',
    { windowsHide: true },
    (err, stdout) => {
      if (err) {
        return cb(err);
      }

      const lines = replaceStdout(stdout);

      lines.shift();

      const drives = lines.map((line: any) => parse(line));

      try {
        cb(null, drives);
      } catch (e) {
        cb(e);
      }
    }
  );
};

export const replaceStdout = (stdout: string) => {
  return stdout
    .replace(/\r\n/g, "\n")
    .split("\n")
    .filter((line: string) => line.trim().length)
    .map((line) => {
      const match = line.trim().match(/^(\w:)\s+(\S+)\s+(\d+)\s+(\d+)$/);
      if (match) {
        return [match[1], match[2], match[3], match[4]];
      }
      return [];
    })
    .filter((parts) => parts.length > 0);
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

module.exports = {
  execDriveList,
  parse,
  replaceStdout,
};
