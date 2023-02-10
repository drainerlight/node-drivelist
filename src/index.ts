import { platform } from "os";
import { DriveDataInterface } from "./Interfaces";
import { ExecException, ExecFileException } from "child_process";

let execDriveList: any;

if (platform() === "win32") {
  execDriveList = require("./win32").execDriveList;
} else {
  execDriveList = require("./posix").execDriveList;
}

const getDriveList = () => {
  return new Promise((resolve) => {
    execDriveList(
      (
        err: ExecException | ExecFileException | null,
        driveList: DriveDataInterface[]
      ) => resolve(driveList)
    );
  });
};


getDriveList().then(result => console.info("INFO =>result", result));


const getDriveByName = async (driveName: string) => {
  const driveList = (await getDriveList()) as DriveDataInterface[];

  for (const drive of driveList) {
    if (drive.name === driveName) {
      return drive;
    }
  }

  return null;
};

module.exports = {
  getDriveList,
  getDriveByName,
};
