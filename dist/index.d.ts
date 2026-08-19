import { DriveDataInterface } from "./Interfaces";
export type DriveListCallback = (err: Error | null, drives?: DriveDataInterface[]) => void;
export declare const getDriveList: () => Promise<DriveDataInterface[]>;
export declare const getDriveByName: (driveName: string) => Promise<DriveDataInterface | null>;
