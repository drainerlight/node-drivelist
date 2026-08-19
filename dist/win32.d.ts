import { DriveDataInterface } from "./Interfaces";
export type DriveListCallback = (err: Error | null, drives?: DriveDataInterface[]) => void;
export declare const execDriveList: (cb: DriveListCallback) => void;
export declare const replaceStdout: (stdout: string) => string[][];
export declare const parse: (line: string[]) => DriveDataInterface;
declare const _default: {
    execDriveList: (cb: DriveListCallback) => void;
    parse: (line: string[]) => DriveDataInterface;
    replaceStdout: (stdout: string) => string[][];
};
export default _default;
