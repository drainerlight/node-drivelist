import { DriveDataInterface } from "./Interfaces";
export type DriveListCallback = (err: Error | null, drives?: DriveDataInterface[]) => void;
export declare const execDriveList: (cb: DriveListCallback) => void;
export declare const parse: (driveLine: string) => DriveDataInterface;
declare const _default: {
    execDriveList: (cb: DriveListCallback) => void;
    parse: (driveLine: string) => DriveDataInterface;
};
export default _default;
