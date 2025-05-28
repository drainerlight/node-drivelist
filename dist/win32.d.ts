import { DriveDataInterface } from "./Interfaces";
export declare const execDriveList: (cb: any) => void;
export declare const replaceStdout: (stdout: string) => string[][];
export declare const parse: (line: string[]) => DriveDataInterface;
