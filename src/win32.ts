import { exec } from "child_process";
import { DriveDataInterface } from "./Interfaces";
import { isNumber } from "util";

const execDriveList = (cb: any) => {
  //Logicaldisk get order the parameters has no effect
  exec(
    "WMIC LOGICALDISK GET Name, VolumeName, Size, FreeSpace",
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

const replaceStdout = (stdout: string) => {
  return stdout
    .replace(/\r\r\n/g, "\n")
    .split("\n")
    .filter((line: string) => line.length)
    .filter((line: string) => /^\d+$/.test(line[0]))
    .map((line) => line.split(" ").filter((x) => x !== ""));
};

const parse = (line: string[]): DriveDataInterface => {
  const available = Number(line[0]);
  const mountpoint = line[1];
  const total = Number(line[2]);
  const name = line[3];
  const used = total - available;
  const percentageUsed = Math.round((used / total) * 100);

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
