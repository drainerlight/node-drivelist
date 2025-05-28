export interface DriveDataInterface {
    total: number;
    used: number;
    available: number;
    percentageUsed: number;
    mountpoint: string;
    name: string | undefined;
}
