import { DriveDataInterface } from "./Interfaces";
export declare const getDriveList: () => Promise<DriveDataInterface[]>;
export declare const getDriveByName: (driveName: string) => Promise<DriveDataInterface | null>;
