import { platform } from "os";
import { DriveDataInterface } from "./Interfaces";
import { execDriveList as posixExecDriveList } from "./posix";
import { execDriveList as win32ExecDriveList } from "./win32";

export type DriveListCallback = (
  err: Error | null,
  drives?: DriveDataInterface[]
) => void;

const execDriveList: (cb: DriveListCallback) => void =
  platform() === "win32" ? win32ExecDriveList : posixExecDriveList;

export const getDriveList = (): Promise<DriveDataInterface[]> => {
  return new Promise((resolve, reject) => {
    execDriveList((err, driveList) => {
      if (err) {
        reject(err);
      } else {
        resolve(driveList || []);
      }
    });
  });
};

export const getDriveByName = async (
  driveName: string
): Promise<DriveDataInterface | null> => {
  const driveList = await getDriveList();

  for (const drive of driveList) {
    if (drive.name === driveName) {
      return drive;
    }
  }

  return null;
};
